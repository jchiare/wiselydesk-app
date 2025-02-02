import Anthropic from "@anthropic-ai/sdk";
import { BaseLLM } from "./base-llm";
import { StreamResponse } from "./types";

export class AnthropicLLM extends BaseLLM {
  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic();
  }

  async stream(
    systemPrompt: string,
    messages: Anthropic.Messages.MessageParam[],
    options: { model?: string; temperature?: number; maxTokens?: number } = {}
  ): Promise<StreamResponse> {
    const {
      model = "claude-3-5-sonnet-20240620",
      temperature = 0,
      maxTokens = 2000
    } = options;

    const response = await this.client.messages.create({
      system: systemPrompt,
      model,
      temperature,
      messages,
      stream: true,
      max_tokens: maxTokens
    });

    return response;
  }

  parseChunk(
    event: Anthropic.Messages.RawMessageStreamEvent
  ): string | undefined {
    switch (event.type) {
      case "content_block_start":
        if (event.content_block.type === "text") {
          return event.content_block.text;
        }
        break;
      case "content_block_delta":
        if (event.delta.type === "text_delta") {
          return event.delta.text;
        }
        break;
    }
    return undefined;
  }

  getModelVersion(): string {
    return "claude-3-5-sonnet-20240620";
  }

  shouldSkipChunk(chunk: Anthropic.Messages.RawMessageStreamEvent): boolean {
    const content = this.parseChunk(chunk);
    return content === "" || content === undefined;
  }
}
