import prisma from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import { OpenAIEmbedder } from "@/lib/shared/services/openai/embeddings";
import type { KnowledgeBaseArticle } from "@prisma/client";

interface ExtendedKnowledgeBaseArticle
  extends Omit<KnowledgeBaseArticle, "content_embedding"> {
  content_embedding: number[];
}

type ArticleEmbeddings = {
  title: string;
  content: string;
  tokens: number;
  distance: number;
  source: string;
};

type ContextEmbeddings = {
  content: string;
  sources: string[];
};

export class KbaSearch {
  private botId: number;
  private prisma: PrismaClient;
  private openAiEmbedder: OpenAIEmbedder;
  kbaVersionMap: Map<string, number>;

  constructor(botId: number, prisma: PrismaClient) {
    this.botId = botId;
    this.prisma = prisma;
    this.openAiEmbedder = new OpenAIEmbedder();
    this.kbaVersionMap = new Map<string, number>([
      ["4", 2],
      ["3", 1],
      ["2", 1],
      ["1", 1]
    ]);
  }

  async getTopKArticlesObject(userInput: string): Promise<any[]> {
    const startTime = Date.now();

    const embeddedUserInput =
      await this.openAiEmbedder.createEmbedding(userInput);
    const articles = await this.getDbArticles();
    const topMatchingArticlesObject = this.getTopMatchingEmbeddings(
      articles,
      embeddedUserInput,
      4
    );

    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; // Convert ms to seconds
    console.log(
      `Time taken to get top articles: ${elapsedTime.toFixed(4)} seconds`
    );
    return topMatchingArticlesObject;
  }

  createContextFromTopMatchingArticles(
    topMatchingArticles: ArticleEmbeddings[],
    n: number,
    createInlineSources: boolean = true
  ): ContextEmbeddings {
    const content: string[] = [];
    const sources: string[] = [];
    const distanceUpperBound = 0.5;

    for (const article of topMatchingArticles) {
      console.log(`distance: ${article.distance}`);
      if (article.distance > distanceUpperBound) {
        content.push(this.createContent(article, createInlineSources));
        sources.push(article.source);
      }
    }

    if (sources.length === 0 && topMatchingArticles.length > 0) {
      console.log(`No articles with distance ${distanceUpperBound} found`);
      const firstArticle = topMatchingArticles[0];
      content.push(this.createContent(firstArticle, createInlineSources));
      sources.push(firstArticle.source);
    }

    return {
      content: content.slice(0, n).join(" "),
      sources: sources.slice(0, n)
    };
  }

  private createContent(
    article: ArticleEmbeddings,
    createInlineSources: boolean
  ): string {
    if (createInlineSources) {
      return `${article.content} -- Url: (${article.source})`;
    }
    return article.content;
  }

  private async getDbArticles(): Promise<ExtendedKnowledgeBaseArticle[]> {
    const version = this.kbaVersionMap.get(this.botId.toString()) ?? 1;
    const articles = await this.prisma.knowledgeBaseArticle.findMany({
      where: { bot_id: this.botId, version: version }
    });

    if (articles.length === 0) {
      throw new Error(`No articles found for bot id ${this.botId}`);
    }

    return articles.map(article => ({
      ...article,
      content_embedding: article.content_embedding
        .slice(1, -1)
        .split(",")
        .map(parseFloat)
    }));
  }

  private getTopMatchingEmbeddings(
    articles: ExtendedKnowledgeBaseArticle[],
    queryEmbedding: number[],
    n: number
  ): ArticleEmbeddings[] {
    const embeddings = articles.map(article => article.content_embedding);

    const mostSimilarArticles = this.openAiEmbedder.getTopKSimilarities(
      queryEmbedding,
      embeddings,
      n
    );

    return mostSimilarArticles.map(article => ({
      title: articles[article.index].title,
      content: articles[article.index].content,
      tokens: articles[article.index].total_token_count,
      distance: article.similarity,
      source: articles[article.index].html_url
    }));
  }
}
