import { ZendeskKbaParser } from "@/lib/shared/services/zendesk/kba-parser";
import prisma from "@/lib/prisma";
import {
  ExternalZendeskArticle,
  createInternalZendeskArticle,
  type ExternalZendeskArticlesResponse,
  type Category,
  type Section,
  type FolderEnhancement,
  type ExpandedExternalZendeskArticle,
  type InternalZendeskArticle
} from "@/lib/shared/services/zendesk/dto";
import type { PrismaClient } from "@prisma/client";

function excludeKbWithTags(
  botId: string,
  kb: InternalZendeskArticle,
  tags: string[] = ["ios-whitelist", "android-whitelist"]
): boolean {
  return (
    ["3", "4"].includes(botId) &&
    kb.labelNames.some((label: string) => tags.includes(label.toLowerCase()))
  );
}

export class ZendeskKbaImporter {
  private readonly ALL_KBAS_PATH_ENDING = "?include=categories,sections";
  botId: string;
  zendeskKbaParser: ZendeskKbaParser;
  private prisma: PrismaClient;
  private articleEnhancementMap: Map<number, FolderEnhancement>;
  kbaVersionMap: Map<string, number>;

  constructor(botId: string, zendeskKbaParser?: ZendeskKbaParser) {
    this.botId = botId;
    this.zendeskKbaParser = zendeskKbaParser ?? new ZendeskKbaParser();
    this.prisma = prisma;
    this.articleEnhancementMap = new Map<number, FolderEnhancement>();
    this.kbaVersionMap = new Map<string, number>([
      ["4", 2],
      ["3", 1],
      ["2", 1],
      ["1", 1]
    ]);
  }

  async importAllKbas(): Promise<void> {
    let zendeskHelpCentreUrl: string | null = await this.getKbaUrl();
    let counter = 0;

    while (zendeskHelpCentreUrl) {
      const response = await fetch(zendeskHelpCentreUrl);
      const data = (await response.json()) as ExternalZendeskArticlesResponse;
      zendeskHelpCentreUrl = data.next_page;

      // create the categories only once
      if (this.shouldAddCategories()) {
        this.createArticleEnhancementMap(
          data.categories,
          data.sections,
          data.articles
        );
      }
      for (const kbaData of data.articles) {
        const kba = createInternalZendeskArticle(kbaData);
        const shouldExcludeKb = excludeKbWithTags(this.botId, kba);

        console.log("Processing KBA: ", kba.id);
        const version = this.kbaVersionMap.get(this.botId) ?? 1;
        if (
          !shouldExcludeKb &&
          (await this.checkIfKbaNeedsUpdate(kba, version))
        ) {
          if (this.shouldAddCategories()) {
            await this.updateKba(
              kba,
              version,
              this.articleEnhancementMap.get(kba.id)
            );
          } else {
            await this.updateKba(kba, version);
          }
          console.log("Updated KBA: ", kba.id);
          counter++;
        }
      }
    }

    console.log(`Updated ${counter} KBAs`);
  }

  private async getKbaUrl(): Promise<string> {
    const zendeskHelpCentreUrl = await this.prisma.bot
      .findUnique({ where: { id: parseInt(this.botId, 10) } })
      .then(bot => bot?.zendesk_kba_endpoint);

    if (!zendeskHelpCentreUrl) {
      throw new Error(
        `Zendesk_kba_endpoint is not set for botId ${this.botId}`
      );
    }

    return zendeskHelpCentreUrl + this.ALL_KBAS_PATH_ENDING;
  }

  private async getSingleKbaUrl(kbaId: string): Promise<string> {
    const zendeskHelpCentreUrl = await this.prisma.bot
      .findUnique({ where: { id: parseInt(this.botId, 10) } })
      .then(bot => bot?.zendesk_kba_endpoint);

    if (!zendeskHelpCentreUrl) {
      throw new Error(
        `Zendesk_kba_endpoint is not set for botId ${this.botId}`
      );
    }

    return `${zendeskHelpCentreUrl}/${kbaId}${this.ALL_KBAS_PATH_ENDING}`;
  }

  async deleteSingleKbaUncertainBot(
    kbaId: string,
    botIds: number[]
  ): Promise<void> {
    await this.prisma.knowledgeBaseArticle.deleteMany({
      where: {
        AND: [
          { bot_id: { in: botIds.map(id => id) } },
          { client_article_id: kbaId }
        ]
      }
    });
  }

  async deleteSingleKba(kbaId: string): Promise<void> {
    const article = await this.prisma.knowledgeBaseArticle.findFirst({
      where: {
        bot_id: parseInt(this.botId, 10),
        client_article_id: kbaId
      }
    });

    if (article) {
      await this.prisma.knowledgeBaseArticle.delete({
        where: {
          id: article.id,
          bot_id: parseInt(this.botId, 10)
        }
      });
    } else {
      console.log(
        `Article with client_article_id ${kbaId} and bot_id ${this.botId} not found.`
      );
    }
  }
  private async checkIfKbaNeedsUpdate(
    kba: InternalZendeskArticle,
    version: number
  ): Promise<boolean> {
    const existingArticle = await this.prisma.knowledgeBaseArticle.findFirst({
      where: { client_article_id: kba.id.toString(), version: version }
    });

    if (!existingArticle) {
      return true;
    }

    const kbaUpdatedAt = new Date(kba.updatedAt);
    const lastUpdated = existingArticle.updated_at
      ? new Date(existingArticle.updated_at)
      : new Date(existingArticle.created_at);

    return kbaUpdatedAt > lastUpdated;
  }

  async importSingleKba(kbaId: string): Promise<void> {
    const zendeskHelpCentreUrl = await this.getSingleKbaUrl(kbaId);

    const response = await fetch(zendeskHelpCentreUrl);
    const data = (await response.json()) as ExpandedExternalZendeskArticle;

    if (!data.article) {
      console.error(
        `Article ${kbaId} not found in Zednesk for bot ${this.botId}`
      );
      return;
    }

    const kba = createInternalZendeskArticle(data.article);
    const folderEnhancement = {
      categoryTitle: data.categories?.[0]?.name || "",
      sectionTitle: data.sections?.[0]?.name || ""
    };
    const version = this.kbaVersionMap.get(this.botId) ?? 1;
    await this.updateKba(kba, version, folderEnhancement);
  }

  private async updateKba(
    kba: InternalZendeskArticle,
    version: number,
    folderEnhancement?: FolderEnhancement
  ): Promise<void> {
    // Assuming enhanceArticleWithEmbedding returns an object suitable for Prisma operations
    const formattedKba =
      await this.zendeskKbaParser.enhanceArticleWithEmbedding(
        kba,
        this.botId.toString(),
        folderEnhancement
      );

    // Check if the article exists and upsert accordingly
    const existingArticleId = await this.prisma.knowledgeBaseArticle.findFirst({
      where: { client_article_id: kba.id.toString(), version: version },
      select: { id: true } // Only select the id for efficiency
    });

    if (!existingArticleId) {
      console.log(`KBA ${kba.id} not found in DB, creating new one.`);
    }

    // Since Prisma's upsert requires a unique identifier in 'where',
    // ensure your logic aligns with Prisma's expectations for 'client_article_id'.
    await this.prisma.knowledgeBaseArticle.upsert({
      where: { id: existingArticleId ? existingArticleId.id : -1 }, // Fallback to an impossible id if not found
      update: formattedKba,
      create: formattedKba
    });
  }

  // should move outside this service at some point
  // only add for amboss German for now
  private shouldAddCategories(): boolean {
    return ["4"].includes(this.botId);
  }

  private createArticleEnhancementMap(
    categories: Category[] | undefined,
    sections: Section[] | undefined,
    articles: ExternalZendeskArticle[]
  ): void {
    if (!categories || !sections || !articles) {
      return;
    }

    this.articleEnhancementMap = new Map<number, FolderEnhancement>();

    for (const article of articles) {
      const section = sections.find(s => s.id === article.section_id);
      if (section) {
        const category = categories.find(c => c.id === section.category_id);
        if (category) {
          this.articleEnhancementMap.set(article.id, {
            categoryTitle: category.name,
            sectionTitle: section.name
          });
        }
      }
    }
  }
}
