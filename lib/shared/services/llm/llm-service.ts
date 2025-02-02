import { BaseLLM } from "./base-llm";

export class LLMService {
  private primaryLLM: BaseLLM;
  private fallbackLLM: BaseLLM;
  private maxRetries: number;

  constructor(
    primaryLLM: BaseLLM,
    fallbackLLM: BaseLLM,
    maxRetries: number = 2
  ) {
    this.primaryLLM = primaryLLM;
    this.fallbackLLM = fallbackLLM;
    this.maxRetries = maxRetries;
  }

  async streamWithFallback(
    systemPrompt: string,
    messages: any[],
    options: any = {}
  ) {
    let attempts = 0;
    let lastError;

    while (attempts < this.maxRetries) {
      try {
        const response = await this.primaryLLM.stream(
          systemPrompt,
          messages,
          options
        );
        return {
          response,
          llm: this.primaryLLM
        };
      } catch (error) {
        lastError = error;
        attempts++;
        console.error(`Primary LLM attempt ${attempts} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // If primary LLM failed, try fallback LLM
    attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const response = await this.fallbackLLM.stream(
          systemPrompt,
          messages,
          {} // don't use default options for fallback LLM
        );
        return {
          response,
          llm: this.fallbackLLM
        };
      } catch (error) {
        lastError = error;
        attempts++;
        console.error(`Fallback LLM attempt ${attempts} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    throw lastError;
  }
}
