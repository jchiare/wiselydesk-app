import OpenAI from "openai";
import { type TiktokenModel } from "js-tiktoken";

export type EmbeddingModelTypes = TiktokenModel;

export class OpenAIEmbedder {
  private model: string;
  private openai: OpenAI;

  constructor(model: string = "text-embedding-ada-002") {
    this.model = model;
    this.openai = new OpenAI();
  }

  public async createEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.openai.embeddings.create({
        model: this.model,
        input: text
        // dimensions: 1536
      });
      return result.data[0].embedding;
    } catch (error) {
      console.warn("Retrying due to error:", error);
      throw error; // Rethrow error to continue retrying
    }
  }

  public getTopKSimilarities(
    queryEmbedding: number[],
    targetEmbeddings: number[][],
    k: number = 5
  ): { index: number; similarity: number }[] {
    const allSimilarities = this.distancesFromEmbeddingWithIndices(
      queryEmbedding,
      targetEmbeddings
    );
    allSimilarities.sort((a, b) => b.similarity - a.similarity);
    return allSimilarities.slice(0, k);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce(
      (acc, current, idx) => acc + current * vecB[idx],
      0
    );
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private distancesFromEmbeddingWithIndices(
    queryEmbedding: number[],
    targetEmbeddings: number[][]
  ): { index: number; similarity: number }[] {
    return targetEmbeddings.map((targetEmbedding, index) => ({
      index,
      similarity: this.cosineSimilarity(queryEmbedding, targetEmbedding)
    }));
  }
}
