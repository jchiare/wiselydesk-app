import Anthropic from "@anthropic-ai/sdk";

type AnthropicChat = {
  inputTokens?: number;
  outputTokens?: number;
  fullResponse?: string;
};
export class AnthropicLLM {
  private client: Anthropic;
  public chat: AnthropicChat;

  constructor() {
    this.client = new Anthropic();
    this.chat = {};
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

  handleStreamEvent(event: Anthropic.Messages.RawMessageStreamEvent) {
    switch (event.type) {
      case "message_start":
        this.chat = {
          inputTokens: event.message.usage.input_tokens
        };
        break;
      case "content_block_start":
        if (event.content_block.type === "text") {
          this.chat.fullResponse = event.content_block.text;
          break;
        }

        throw new Error("Got somewhere we shouldn't be start");
      case "content_block_delta":
        if (event.delta.type === "text_delta") {
          this.chat.fullResponse += event.delta.text;
          break;
        }

        throw new Error("Got somewhere we shouldn't be delta");
      case "message_delta":
        this.chat.outputTokens = event.usage.output_tokens;
        break;
      default:
        throw new Error(
          `Got somewhere we shouldn't be ${JSON.stringify(event)}`
        );
        break;
    }
  }
  public chatData() {
    return this.chat;
  }
}
