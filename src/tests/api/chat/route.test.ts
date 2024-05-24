import {
  inputCost,
  outputCost,
  trimMessageUnder8KTokens
} from "@/lib/shared/services/openai/cost";
import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";

const MOCK_MESSAGE: OpenAiMessage[] = [
  { content: "Test message", role: "user" }
];

// Adjusting for a scenario that ensures the input message array is under 8k tokens after processing
const aLargeString = "This is a large string".repeat(2400); // Make sure this is large enough to test the token limit

const MOCK_SYSTEM_MESSAGE_OVER_5K: OpenAiMessage[] = [
  { content: aLargeString, role: "system" }, // Assuming the role "system" indicates system messages
  { content: "Second message", role: "user" }
];

const aBigString = "This is a big string".repeat(930);

// Example messages array that would exceed the 5K token limit if not modified
const MOCK_MESSAGES_OVER_5K: OpenAiMessage[] = [
  { content: aBigString, role: "user" },
  { content: aBigString, role: "user" },
  { content: aBigString, role: "user" }
];

describe("inputCost", () => {
  it("calculates cost correctly for gpt-4 with short message", () => {
    const model = "gpt-4o";
    const expectedCost =
      (JSON.stringify(MOCK_MESSAGE).length / 4 / 1000) * 0.005;
    expect(inputCost(MOCK_MESSAGE, model)).toBeCloseTo(expectedCost);
  });

  it("handles large messages by adjusting content before cost calculation for gpt-4", () => {
    const model = "gpt-4o";
    // Expect the function to not throw due to message size after adjustment
    expect(() => inputCost(MOCK_MESSAGES_OVER_5K, model)).not.toThrow();
  });

  it("large system messages throw error", () => {
    // Expect the function to throw due to message size
    expect(() =>
      trimMessageUnder8KTokens(MOCK_SYSTEM_MESSAGE_OVER_5K)
    ).toThrow();
  });

  it("calculates cost with message adjustment for large message arrays", () => {
    const model = "gpt-4o";

    const adjustedMessages = trimMessageUnder8KTokens(MOCK_MESSAGES_OVER_5K);
    expect(adjustedMessages.length).toBeLessThan(MOCK_MESSAGES_OVER_5K.length);
    expect(JSON.stringify(adjustedMessages).length).toEqual(
      JSON.stringify([MOCK_MESSAGES_OVER_5K[0], MOCK_MESSAGES_OVER_5K[2]])
        .length
    );
    const expectedCost =
      (JSON.stringify(adjustedMessages).length / 4 / 1000) * 0.005;
    expect(inputCost(adjustedMessages, model)).toBeCloseTo(expectedCost);
  });

  it("calculates cost correctly for gpt-3.5-turbo with short message", () => {
    const model = "gpt-3.5-turbo";
    const expectedCost =
      (JSON.stringify(MOCK_MESSAGE).length / 4 / 1000) * 0.002;
    expect(inputCost(MOCK_MESSAGE, model)).toBeCloseTo(expectedCost);
  });

  it("throws error for invalid model", () => {
    const model = "invalid-model";
    expect(() => inputCost(MOCK_MESSAGE, model)).toThrow(
      "Invalid model: invalid-model"
    );
  });
});

describe("outputCost", () => {
  it("calculates cost correctly for gpt-4 output", () => {
    const output = "This is a test output";
    const model = "gpt-4";
    const expectedCost = (output.length / 4 / 1000) * 0.06;
    expect(outputCost(output, model)).toBeCloseTo(expectedCost);
  });

  it("calculates cost correctly for gpt-3.5-turbo output", () => {
    const output = "Another output test";
    const model = "gpt-3.5-turbo";
    const expectedCost = (output.length / 4 / 1000) * 0.002;
    expect(outputCost(output, model)).toBeCloseTo(expectedCost);
  });

  it("throws error for invalid model in output cost calculation", () => {
    const output = "Invalid model test for output";
    const model = "invalid-model";
    expect(() => outputCost(output, model)).toThrow(
      "Invalid model: invalid-model"
    );
  });
});
