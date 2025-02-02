export interface StreamMetadata {
  conversationId: number;
  messageId: number;
  sources: string[];
  model: string;
  startTime: number;
  inputAiCost: number;
}

export interface StreamResponse {
  text?: string;
  sources?: string[];
  conversation_id?: number;
  message_id?: number;
}
