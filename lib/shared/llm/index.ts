import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

type LLMMessage = {
  role: string;
  content: string;
};

export class LLM {
  client: Anthropic | OpenAI;
  model: string;
  useAnthropic: boolean;

  constructor(model: string) {
    this.model = model;
    this.client = this.createClientByModel(model);
    this.useAnthropic = ["claude3.5"].includes(model);
  }

  private createClientByModel(model: string) {
    if (model === "claude3.5") {
      this.model = "claude-3-5-sonnet-20240620";
      return new Anthropic();
    }
    return new OpenAI();
  }

  async chat(
    messages: LLMMessage[],
    {
      stream = true,
      temperature = 0
    }: { stream?: boolean; temperature?: number } = {}
  ) {
    if (this.useAnthropic) {
      const systemMessage = messages.find(message => message.role === "system");
      if (!systemMessage) {
        throw new Error("System message is required for anthropic");
      }

      const filteredMessages = messages.filter(
        message => message.role !== "system"
      );

      return (this.client as Anthropic).messages.create({
        system: systemMessage.content,
        model: this.model,
        messages: filteredMessages as any,
        stream,
        temperature,
        max_tokens: 2000
      });
    }
    return (this.client as OpenAI).chat.completions.create({
      model: this.model,
      messages: messages as any,
      stream,
      temperature
    });
  }
}
