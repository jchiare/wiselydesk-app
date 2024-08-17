import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";

type ParsedPayload = {
  model: string;
  messages: OpenAiMessage[];
  userInput: string;
  clientApiKey: string;
  clientSentConversationId: number | undefined;
  chatty: boolean | undefined;
  location: string | undefined;
};
export function parsePayload(payload: any): ParsedPayload {
  const model = payload.model || "gpt-4o";
  const clientApiKey = payload.clientApiKey;
  const chatty = payload.chatty;
  const location = payload.location;

  if (
    !payload.messages ||
    !Array.isArray(payload.messages) ||
    payload.messages.length === 0
  ) {
    throw new Error("Invalid payload, messages key is missing or empty");
  }

  const messages = payload.messages;
  const userInput = messages[messages.length - 1].content;

  if (!userInput) {
    throw new Error(
      "Invalid payload, user input is missing from the last message"
    );
  }

  return {
    chatty,
    model,
    messages,
    userInput,
    clientApiKey,
    location,
    clientSentConversationId: payload.conversationId
      ? parseInt(payload.conversationId, 10)
      : undefined
  };
}

// put this in redis / cache at some point
export const BOT_ID_MAPPING: Record<string, number> = {
  qGmNXgVcRRwVpL6i2bIDDYvPc8lJcSvndKE7DUZzq5M: 1,
  "12345ApiKey": 2,
  "2JcUUnHpgW5PAObuSmSGCsCRgW3Hhqg5yiznEZnAzzY": 3,
  hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE: 4
};

export function parseBotId(clientApiKey: string): number {
  const botId = BOT_ID_MAPPING[clientApiKey];
  if (!botId) {
    console.log(
      "Invalid client api key: ",
      clientApiKey,
      " defaulting to 1 / WiselyDesk"
    );
    return 1;
  }
  return botId;
}
export function removeWiselyDeskTestingKeyword(
  messages: OpenAiMessage[],
  userInput: string
): [string, OpenAiMessage[], boolean] {
  const WISELYDESK_TESTING_KEYWORD = "wdtest";
  const isProductionTesting = userInput.startsWith(WISELYDESK_TESTING_KEYWORD);

  const cleanedUserInput = isProductionTesting
    ? userInput.replace(`${WISELYDESK_TESTING_KEYWORD} `, "")
    : userInput;

  return [cleanedUserInput, messages, isProductionTesting];
}
