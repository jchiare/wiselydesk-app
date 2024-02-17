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
      });
      return result.data[0].embedding;
    } catch (error) {
      console.warn("Retrying due to error:", error);
      throw error; // Rethrow error to continue retrying
    }
  }
}
