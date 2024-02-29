import { encodingForModel } from "js-tiktoken";
import { type EmbeddingModelTypes } from "@/lib/shared/services/openai/embeddings";

export function numTokensFromString(
  string: string,
  encodingModel: EmbeddingModelTypes
): number {
  const encoding = encodingForModel(encodingModel);
  const numTokens = encoding.encode(string).length;
  return numTokens;
}
