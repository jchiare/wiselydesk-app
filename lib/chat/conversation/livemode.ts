const IS_CONVERSATION_TEST_DATA: Record<number, string> = {
  2: "^\\s*[a-zA-Z]{3}:",
  3: "^\\s*[a-zA-Z]{3}:",
  4: "^\\s*[a-zA-Z]{3}:"
};

export function isConversationLivemode(
  userInput: string,
  botId: number
): boolean {
  const botTestmodeRegex = IS_CONVERSATION_TEST_DATA[botId];

  // If there is no botTestmodeRegex for test, then livemode is always true
  if (!botTestmodeRegex) {
    return true;
  }

  const pattern = new RegExp(botTestmodeRegex);
  const match = pattern.test(userInput);
  return !match;
}
