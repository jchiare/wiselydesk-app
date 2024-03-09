import { PrismaClient } from "@prisma/client";
import { OpenAIEmbedder } from "@/lib/shared/services/openai/embeddings";
import type { KnowledgeBaseArticle } from "@prisma/client";

interface ExtendedKnowledgeBaseArticle
  extends Omit<KnowledgeBaseArticle, "content_embedding"> {
  content_embedding: number[];
}

export class KbaSearch {
  private botId: number;
  private prisma: PrismaClient;
  private openAiEmbedder: OpenAIEmbedder;

  constructor(botId: number, prisma: PrismaClient) {
    this.botId = botId;
    this.prisma = prisma;
    this.openAiEmbedder = new OpenAIEmbedder();
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

  private async getDbArticles(): Promise<ExtendedKnowledgeBaseArticle[]> {
    const articles = await this.prisma.knowledgeBaseArticle.findMany({
      where: { bot_id: this.botId }
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
  ): any[] {
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
