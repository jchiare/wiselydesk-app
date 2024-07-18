import {
  ambossEnglishContextPromptGpt4SupportTicket,
  ambossGermanContextPromptGpt4SupportTicket,
  georgiaCookiesContextPromptGpt4SupportTicket
} from "@/lib/chat/prompts/model";

export function getSystemMessagePrompt(
  botId: number,
  context: string,
  createInlineSources: boolean = true,
  chatty: boolean = false
): string {
  if (botId === 2) {
    if (process.env.DATABASE_URL?.includes("ad3l0rv")) {
      return ambossEnglishContextPromptGpt4SupportTicket(
        context,
        createInlineSources,
        chatty
      );
    }
    throw new Error("Bot 2 shouldn't work");
  } else if (botId === 3) {
    return ambossEnglishContextPromptGpt4SupportTicket(
      context,
      createInlineSources,
      chatty
    );
  } else if (botId === 4) {
    return ambossGermanContextPromptGpt4SupportTicket(
      context,
      createInlineSources,
      chatty
    );
  }
  if (createInlineSources) {
    return georgiaCookiesContextPromptGpt4SupportTicket(
      context,
      createInlineSources
    );
  }

  // Default for the fake help center demo in the landing page
  return georgiaCookiesContextPromptGpt4SupportTicket(
    context,
    createInlineSources
  );
}
