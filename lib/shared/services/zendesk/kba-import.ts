import { ZendeskKbaParser } from "@/lib/shared/services/zendesk/kba-parser";
import prisma from "@/lib/prisma";
import {
  ExternalZendeskArticle,
  type ExternalZendeskArticlesResponse,
  type Category,
  type Section,
  type FolderEnhancement,
  type ExpandedExternalZendeskArticle
} from "@/lib/shared/services/zendesk/dto";
import type { PrismaClient } from "@prisma/client";

// configuration that can be moved to environment variables
// or a config file at some point
const ZENDESK_CONFIG = {
  EXCLUDED_BOT_IDS: ["3", "4"] as const,
  EXCLUDED_TAGS: ["ios-whitelist", "android-whitelist"] as const,
  CATEGORY_ENABLED_BOT_IDS: ["4"] as const,
  PATH_SUFFIX: "?include=categories,sections"
} as const;

class ZendeskApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ZendeskApiError";
  }
}

function excludeKbWithTags(botId: string, kb: ExternalZendeskArticle): boolean {
  return (
    ZENDESK_CONFIG.EXCLUDED_BOT_IDS.includes(botId as any) &&
    kb.labelNames.some(label =>
      ZENDESK_CONFIG.EXCLUDED_TAGS.includes(label.toLowerCase() as any)
    )
  );
}

export class ZendeskKbaImporter {
  private readonly prisma: PrismaClient;
  private readonly articleEnhancementMap: Map<number, FolderEnhancement>;

  constructor(
    private readonly botId: string,
    private readonly zendeskKbaParser: ZendeskKbaParser = new ZendeskKbaParser()
  ) {
    this.prisma = prisma;
    this.articleEnhancementMap = new Map<number, FolderEnhancement>();
  }

  async importAllKbas(): Promise<void> {
    let nextPageUrl: string = await this.constructKbaUrl();
    let processedCount = 0;

    try {
      while (nextPageUrl) {
        const data =
          await this.fetchZendeskData<ExternalZendeskArticlesResponse>(
            nextPageUrl
          );

        if (this.shouldAddCategories() && data.categories && data.sections) {
          this.createArticleEnhancementMap(
            data.categories,
            data.sections,
            data.articles
          );
        }

        // handle KBAs concurrently
        await Promise.all(
          data.articles.map(async kbaData => {
            const kba = new ExternalZendeskArticle(kbaData);

            if (excludeKbWithTags(this.botId, kba)) {
              return;
            }

            if (await this.checkIfKbaNeedsUpdate(kba)) {
              await this.updateKba(
                kba,
                this.shouldAddCategories()
                  ? this.articleEnhancementMap.get(kba.id)
                  : undefined
              );
              processedCount++;
              console.log(`Updated KBA: ${kba.id}`);
            }
          })
        );

        nextPageUrl = data.next_page ?? "";
      }

      console.log(`Successfully updated ${processedCount} KBAs`);
    } catch (error) {
      throw this.handleError(error, "Failed to import KBAs");
    }
  }

  async importSingleKba(kbaId: string): Promise<void> {
    try {
      const url = await this.constructKbaUrl(kbaId);
      const data =
        await this.fetchZendeskData<ExpandedExternalZendeskArticle>(url);

      if (!data.article) {
        throw new ZendeskApiError(
          `Article ${kbaId} not found for bot ${this.botId}`,
          "ARTICLE_NOT_FOUND"
        );
      }

      const kba = new ExternalZendeskArticle(data.article);
      const folderEnhancement =
        data.categories?.[0] && data.sections?.[0]
          ? {
              categoryTitle: data.categories[0].name,
              sectionTitle: data.sections[0].name
            }
          : undefined;

      await this.updateKba(kba, folderEnhancement);
    } catch (error) {
      throw this.handleError(error, `Failed to import KBA ${kbaId}`);
    }
  }

  async deleteSingleKba(kbaId: string): Promise<void> {
    try {
      await this.prisma.knowledgeBaseArticle.deleteMany({
        where: {
          bot_id: parseInt(this.botId, 10),
          client_article_id: kbaId
        }
      });
    } catch (error) {
      throw this.handleError(error, `Failed to delete KBA ${kbaId}`);
    }
  }

  async deleteSingleKbaUncertainBot(
    kbaId: string,
    botIds: number[]
  ): Promise<void> {
    try {
      await this.prisma.knowledgeBaseArticle.deleteMany({
        where: {
          AND: [{ bot_id: { in: botIds } }, { client_article_id: kbaId }]
        }
      });
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to delete KBA ${kbaId} for bots ${botIds.join(", ")}`
      );
    }
  }

  private async constructKbaUrl(kbaId?: string): Promise<string> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: parseInt(this.botId, 10) },
      select: { zendesk_kba_endpoint: true }
    });

    if (!bot?.zendesk_kba_endpoint) {
      throw new ZendeskApiError(
        `Zendesk_kba_endpoint is not set for botId ${this.botId}`,
        "MISSING_ENDPOINT"
      );
    }

    return kbaId
      ? `${bot.zendesk_kba_endpoint}/${kbaId}${ZENDESK_CONFIG.PATH_SUFFIX}`
      : `${bot.zendesk_kba_endpoint}${ZENDESK_CONFIG.PATH_SUFFIX}`;
  }

  private async fetchZendeskData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ZendeskApiError(
        `Zendesk API request failed: ${response.statusText}`,
        "API_ERROR",
        { status: response.status }
      );
    }

    return response.json() as Promise<T>;
  }

  private async checkIfKbaNeedsUpdate(
    kba: ExternalZendeskArticle
  ): Promise<boolean> {
    const existingArticle = await this.prisma.knowledgeBaseArticle.findFirst({
      where: { client_article_id: kba.id.toString() },
      select: { created_at: true, updated_at: true }
    });

    if (!existingArticle) {
      return true;
    }

    const kbaUpdatedAt = new Date(kba.updatedAt);
    const lastUpdated =
      existingArticle.updated_at ?? existingArticle.created_at;

    return kbaUpdatedAt > lastUpdated;
  }

  private async updateKba(
    kba: ExternalZendeskArticle,
    folderEnhancement?: FolderEnhancement
  ): Promise<void> {
    const options = {
      version: this.botId === "4" ? 2 : 1,
      ...folderEnhancement
    };

    const formattedKba =
      await this.zendeskKbaParser.enhanceArticleWithEmbedding(
        kba,
        this.botId,
        options
      );

    const existingArticle = await this.prisma.knowledgeBaseArticle.findFirst({
      where: { client_article_id: kba.id.toString() },
      select: { id: true }
    });

    await this.prisma.knowledgeBaseArticle.upsert({
      where: { id: existingArticle?.id ?? -1 },
      update: formattedKba,
      create: formattedKba
    });
  }

  private shouldAddCategories(): boolean {
    return ZENDESK_CONFIG.CATEGORY_ENABLED_BOT_IDS.includes(this.botId as any);
  }

  private createArticleEnhancementMap(
    categories: Category[],
    sections: Section[],
    articles: ExternalZendeskArticle[]
  ): void {
    const sectionMap = new Map(sections.map(s => [s.id, s]));
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    this.articleEnhancementMap.clear();

    for (const article of articles) {
      const section = sectionMap.get(article.sectionId);
      if (!section) continue;

      const category = categoryMap.get(section.category_id);
      if (!category) continue;

      this.articleEnhancementMap.set(article.id, {
        categoryTitle: category.name,
        sectionTitle: section.name
      });
    }
  }

  private handleError(error: unknown, context: string): Error {
    if (error instanceof ZendeskApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ZendeskApiError(
        `${context}: ${error.message}`,
        "UNKNOWN_ERROR",
        { originalError: error }
      );
    }

    return new ZendeskApiError(
      `${context}: An unexpected error occurred`,
      "UNKNOWN_ERROR",
      { error }
    );
  }
}
