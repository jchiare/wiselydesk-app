import OpenAI from "openai";
import { BaseLLM } from "./base-llm";
import { StreamResponse } from "./types";

const openai = new OpenAI({ maxRetries: 2, timeout: 15 * 1000 });

export class OpenAILLM extends BaseLLM {
  private client: OpenAI;

  constructor(client: OpenAI = openai) {
    super();
    this.client = client;
  }

  async stream(
    systemPrompt: string,
    messages: any[],
    options: { model?: string; temperature?: number } = {}
  ): Promise<StreamResponse> {
    const { model = "gpt-4o", temperature = 0 } = options;
    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      temperature
    });

    return response;
  }

  parseChunk(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk
  ): string | null | undefined {
    return chunk.choices[0]?.delta?.content;
  }

  getModelVersion(chunk: OpenAI.Chat.Completions.ChatCompletionChunk): string {
    return chunk.model;
  }

  shouldSkipChunk(chunk: OpenAI.Chat.Completions.ChatCompletionChunk): boolean {
    const content = chunk.choices[0]?.delta?.content;
    return content === "" || content === undefined;
  }
}
