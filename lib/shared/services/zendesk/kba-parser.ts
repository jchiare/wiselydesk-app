import { JSDOM } from "jsdom";
import {
  ExternalZendeskArticle,
  KnowledgeBaseArticle,
  type FolderEnhancement
} from "@/lib/shared/services/zendesk/dto";
import { numTokensFromString } from "@/lib/shared/services/openai/utils";
import {
  OpenAIEmbedder,
  type EmbeddingModelTypes
} from "@/lib/shared/services/openai/embeddings";

export class ZendeskKbaParser {
  private readonly ADA_TEXT_EMBEDDING = "text-embedding-ada-002";
  private openAIEmbedder: OpenAIEmbedder;
  encodingModel: EmbeddingModelTypes;

  constructor(encodingModel?: EmbeddingModelTypes) {
    this.encodingModel = encodingModel ?? this.ADA_TEXT_EMBEDDING;
    this.openAIEmbedder = new OpenAIEmbedder(this.encodingModel);
  }

  static getSectionName(sectionId: number, sections: any[]): string {
    const section = sections.find(section => section.id === sectionId);
    return section ? section.name : "";
  }

  static mapSectionIdToCategoryId(sections: any[]): any[] {
    return sections.map(section => ({
      sectionId: section.id,
      categoryId: section.categoryId
    }));
  }

  static mapCategoryIdToName(categories: any[]): any[] {
    return categories.map(category => ({
      categoryId: category.id,
      name: category.name
    }));
  }

  static cleanArticleBody(body: string): string {
    const dom = new JSDOM(body);
    const document = dom.window.document;
    const links = document.querySelectorAll("a");
    links.forEach(link => {
      const text = link.textContent;
      const url = link.href;
      const mdLink = `[${text}](${url})`;
      link.replaceWith(mdLink);
    });
    return document.body.textContent?.replace(/\n/g, " ") ?? "";
  }

  async enhanceArticleWithEmbedding(
    article: ExternalZendeskArticle,
    botId: string,
    folderEnhancement?: FolderEnhancement
  ): Promise<KnowledgeBaseArticle> {
    const cleanedArticleBody = ZendeskKbaParser.cleanArticleBody(article.body);
    const contentEmbedding =
      await this.openAIEmbedder.createEmbedding(cleanedArticleBody);
    const totalTokens = numTokensFromString(
      cleanedArticleBody,
      this.encodingModel
    );

    // hacky
    // at some point, get this from the bot config on initialization
    // at some point, change version to 2 for bot 4
    const versionNumber = botId === "4" ? 2 : 1;

    const content = [
      `Article title: ${article.title}.`,
      folderEnhancement
        ? `Category: ${folderEnhancement.categoryTitle}. Section: ${folderEnhancement.sectionTitle}.`
        : "",
      `Text: ${cleanedArticleBody}.`
    ].join(" ");

    return {
      client_article_id: article.id.toString(),
      title: article.title,
      content,
      client_last_updated: article.updatedAt,
      bot_id: parseInt(botId, 10),
      content_embedding: JSON.stringify(contentEmbedding),
      total_token_count: totalTokens,
      html_url: article.htmlUrl,
      updated_at: new Date(),
      version: versionNumber
    };
  }
}
