import { ZendeskKbaParser } from "@/lib/shared/services/zendesk/kba-parser";
import { PrismaClient, type KnowledgeBaseArticle } from "@prisma/client";
import { ZendeskArticle } from "@/lib/shared/services/zendesk/dto";

function excludeKbWithTags(
  botId: string,
  kb: any,
  tags: string[] = ["ios-whitelist", "android-whitelist"]
): boolean {
  if (botId === "3" || botId === "4") {
    for (const label of kb.label_names) {
      if (tags.includes(label.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

class ZendeskKbaClient {
  private readonly ALL_KBAS_PATH_ENDING = "?include=categories,sections";
  botId: string;
  zendeskKbaParser: ZendeskKbaParser;
  private prisma: PrismaClient;

  constructor(botId: string, zendeskKbaParser?: ZendeskKbaParser) {
    this.botId = botId;
    this.zendeskKbaParser = zendeskKbaParser ?? new ZendeskKbaParser();
    this.prisma = new PrismaClient();
  }

  async importAllKbas(): Promise<void> {
    let zendeskHelpCentreUrl = await this.getKbaUrl();
    let counter = 0;

    while (zendeskHelpCentreUrl) {
      const response = await fetch(zendeskHelpCentreUrl);
      const data = await response.json();
      zendeskHelpCentreUrl = data.next_page;

      for (const kbaData of data.articles) {
        const kba = new ZendeskArticle(kbaData);
        const shouldExcludeKb = excludeKbWithTags(this.botId, kba);
        if (!shouldExcludeKb && (await this.checkIfKbaNeedsUpdate(kba))) {
          await this.updateKba(kba, data);
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
  private async checkIfKbaNeedsUpdate(kba: ZendeskArticle): Promise<boolean> {
    const existingArticle = await this.prisma.knowledgeBaseArticle.findFirst({
      where: { client_article_id: kba.id.toString() }
    });

    if (!existingArticle) {
      console.log(`KBA ${kba.id} not found in DB`);
      return true;
    }

    const kbaUpdatedAt = new Date(kba.updatedAt);
    const lastUpdated = existingArticle.updated_at
      ? new Date(existingArticle.updated_at)
      : new Date(existingArticle.created_at);

    return kbaUpdatedAt > lastUpdated;
  }

  async importSingleKba(kbaId: string): Promise<void> {
    const zendeskHelpCentreUrl = await this.getKbaUrl(kbaId);
    const response = await fetch(zendeskHelpCentreUrl).then(res => res.json());

    if (!response.article) {
      console.error(`Article ${kbaId} not found for bot ${this.botId}`);
      return;
    }

    const kba = new ZendeskArticle(response.article);
    if (await this.checkIfKbaNeedsUpdate(kba)) {
      await this.updateKba(kba);
    }
  }

  private async updateKba(kba: ZendeskArticle): Promise<void> {
    // Assume zendeskKbaParser.format returns an object compatible with Prisma's expected input
    const formattedKba = await this.zendeskKbaParser.format(
      kba,
      {},
      this.botId.toString()
    );

    await this.prisma.knowledgeBaseArticle.upsert({
      where: { articleId: kba.id.toString() },
      update: formattedKba,
      create: formattedKba
    });
  }
}
