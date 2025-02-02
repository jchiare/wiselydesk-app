export interface LLMResponse {
  text: string;
  modelVersion?: string;
}

export interface LLMMessage {
  role: string;
  content: string;
}

export interface StreamResponse {
  toReadableStream: () => any;
}
