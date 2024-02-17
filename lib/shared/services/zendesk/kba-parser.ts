import { JSDOM } from "jsdom";
import { ZendeskArticle } from "@/lib/shared/services/zendesk/dto";
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
    article: ZendeskArticle,
    response: any,
    botId: string
  ): Promise<any> {
    let categories;
    if (response.categories) {
      categories = ZendeskKbaParser.mapCategoryIdToName(response.categories);
      const sectionsToCategories = ZendeskKbaParser.mapSectionIdToCategoryId(
        response.sections
      );
      const category = sectionsToCategories.find(
        section => section.sectionId === article.sectionId
      )?.categoryId;
      const categoryName = categories.find(cat => cat.categoryId === category)
        ?.name;
      const sectionName = ZendeskKbaParser.getSectionName(
        article.sectionId,
        response.sections
      );
    }
    const cleanedArticleBody = ZendeskKbaParser.cleanArticleBody(article.body);
    const contentEmbedding =
      await this.openAIEmbedder.createEmbedding(cleanedArticleBody);
    const totalTokens = numTokensFromString(
      cleanedArticleBody,
      this.encodingModel
    );
    return {
      clientArticleId: article.id,
      title: article.title,
      content: `Article title: ${article.title}. Text: ${cleanedArticleBody}. `,
      clientLastUpdated: article.updatedAt,
      botId: botId,
      contentEmbedding: contentEmbedding,
      totalTokenCount: totalTokens,
      htmlUrl: article.htmlUrl
    };
  }
}
