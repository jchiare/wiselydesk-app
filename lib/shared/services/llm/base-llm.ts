import { StreamResponse } from "./types";

export abstract class BaseLLM {
  abstract stream(
    systemPrompt: string,
    messages: any[],
    options?: any
  ): Promise<StreamResponse>;

  abstract parseChunk(chunk: any): string | undefined | null;
  abstract getModelVersion(chunk: any): string | undefined;
  abstract shouldSkipChunk(chunk: any): boolean;
}
