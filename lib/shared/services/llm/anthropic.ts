import Anthropic from "@anthropic-ai/sdk";
export class AnthropicLLM {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async stream(
    systemPrompt: string,
    messages: Anthropic.Messages.MessageParam[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ) {
    const {
      model = "claude-3-5-sonnet-20240620",
      maxTokens = 1000,
      temperature = 0
    } = options;

    try {
      const stream = await this.client.messages.create({
        system: systemPrompt,
        model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages,
        stream: true
      });

      return stream;
    } catch (error) {
      console.error("Error generating stream:", error);
      throw error;
    }
  }

  static getText(
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
}
