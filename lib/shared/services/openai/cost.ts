import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";
import type { TiktokenModel } from "js-tiktoken";

export function inputCost(
  formattedMessage: OpenAiMessage[],
  model: TiktokenModel | string
): number {
  const numTokens = JSON.stringify(formattedMessage).length / 4; // not accurate but better than nothing
  let costPerToken: number;

  switch (model) {
    case "gpt-4":
      costPerToken = 0.03;
      break;
    case "gpt-4o":
      costPerToken = 0.005;
      break;
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    case "claude3.5":
      costPerToken = 0.003;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }

  return (numTokens / 1000) * costPerToken;
}

export function inputCostWithTokens(
  tokens: number | undefined,
  model: TiktokenModel | string
): number {
  if (!tokens) {
    return 0;
  }
  let costPerToken: number;
  switch (model) {
    case "gpt-4":
      costPerToken = 0.03;
      break;
    case "gpt-4o":
      costPerToken = 0.005;
      break;
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    case "claude3.5":
      costPerToken = 0.003;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }
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

  let costPerToken: number;
  switch (model) {
    case "gpt-4":
      costPerToken = 0.06;
      break;
    case "gpt-4o":
      costPerToken = 0.015;
      break;
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    case "claude3.5":
      costPerToken = 0.012;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }

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
  let costPerToken: number;
  switch (model) {
    case "gpt-4":
      costPerToken = 0.06;
      break;
    case "gpt-4o":
      costPerToken = 0.015;
      break;
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    case "claude3.5":
      costPerToken = 0.012;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }
  return parseFloat(((tokens / 1000) * costPerToken).toFixed(4));
}
