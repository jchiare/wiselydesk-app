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
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }

  return (numTokens / 1000) * costPerToken;
}

export function trimMessageUnder5KTokens(
  formattedMessage: OpenAiMessage[]
): OpenAiMessage[] {
  const over5KTokens = JSON.stringify(formattedMessage).length > 5000;
  if (over5KTokens) {
    // remove the earliest messages
    if (formattedMessage.length > 2) {
      const systemMessage = formattedMessage[0];
      const remainingMessagesExcludingFirst = formattedMessage.slice(2);

      return trimMessageUnder5KTokens([
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
    case "gpt-3.5-turbo":
      costPerToken = 0.002;
      break;
    default:
      throw new Error("Invalid model: " + model);
  }

  const cost = (numTokens / 1000) * costPerToken;
  return parseFloat(cost.toFixed(4));
}
