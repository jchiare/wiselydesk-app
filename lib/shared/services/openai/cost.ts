import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";
import type { TiktokenModel } from "js-tiktoken";

function getCostPerToken(
  model: TiktokenModel | string,
  isInput: boolean
): number {
  switch (model) {
    case "gpt-4":
      return isInput ? 0.03 : 0.06;
    case "gpt-4o":
      return isInput ? 0.005 : 0.015;
    case "gpt-4o-2024-08-06":
      return isInput ? 0.002 : 0.01;
    case "gpt-3.5-turbo":
      return 0.002;
    case "claude3.5":
      return isInput ? 0.003 : 0.012;
    default:
      throw new Error("Invalid model: " + model);
  }
}

export function inputCost(
  formattedMessage: OpenAiMessage[],
  model: TiktokenModel | string
): number {
  const numTokens = JSON.stringify(formattedMessage).length / 4; // not accurate but better than nothing
  const costPerToken = getCostPerToken(model, true);
  return (numTokens / 1000) * costPerToken;
}

export function inputCostWithTokens(
  tokens: number | undefined,
  model: TiktokenModel | string
): number {
  if (!tokens) {
    return 0;
  }
  const costPerToken = getCostPerToken(model, true);
  return parseFloat(((tokens / 1000) * costPerToken).toFixed(4));
}

export function trimMessageUnder8KTokens(
  formattedMessage: OpenAiMessage[]
): OpenAiMessage[] {
  const over8KTokens = JSON.stringify(formattedMessage).length / 4 > 13000;
  if (over8KTokens) {
    // remove the earliest messages
    if (formattedMessage.length > 2) {
      const systemMessage = formattedMessage[0];
      const remainingMessagesExcludingFirst = formattedMessage.slice(2);

      return trimMessageUnder8KTokens([
        systemMessage,
        ...remainingMessagesExcludingFirst
      ]);
    }

    throw new Error(
      `Message is too long with length ${
        JSON.stringify(formattedMessage).length
      }`
    );
  }

  return formattedMessage;
}

export function outputCost(
  output: string,
  model: TiktokenModel | string
): number {
  const numTokens = output.length / 4; // not accurate but better than nothing
  const costPerToken = getCostPerToken(model, false);
  const cost = (numTokens / 1000) * costPerToken;
  return parseFloat(cost.toFixed(4));
}

export function outputCostWithTokens(
  tokens: number | undefined,
  model: TiktokenModel | string
): number {
  if (!tokens) {
    return 0;
  }
  const costPerToken = getCostPerToken(model, false);
  return parseFloat(((tokens / 1000) * costPerToken).toFixed(4));
}
