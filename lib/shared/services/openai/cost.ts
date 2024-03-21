import type { TiktokenModel } from "js-tiktoken";

export function inputCost(
  input: string,
  model: TiktokenModel | string
): number {
  const numTokens = input.length / 4; // not accurate but better than nothing
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

  const cost = (numTokens / 1000) * costPerToken;
  return parseFloat(cost.toFixed(4));
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
