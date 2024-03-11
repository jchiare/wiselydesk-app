import {
  ambossEnglishContextPromptGpt4SupportTicket,
  ambossGermanContextPromptGpt4SupportTicket,
  georgiaCookiesContextPrompt
} from "@/lib/chat/prompts/model";

export function getSystemMessagePrompt(
  botId: number,
  context: string,
  createSupportTicket: boolean = true,
  createInlineSources: boolean = true
): string {
  if (botId === 2) {
    if (process.env.DATABASE_ENV === "KBA_TO_DB") {
      return georgiaCookiesContextPrompt(context, createSupportTicket);
    }
    throw new Error("Bot 2 shouldn't work");
  } else if (botId === 3) {
    return ambossEnglishContextPromptGpt4SupportTicket(
      context,
      createInlineSources
    );
  } else if (botId === 4) {
    return ambossGermanContextPromptGpt4SupportTicket(
      context,
      createInlineSources
    );
  }

  // Default for the fake help center demo in the landing page
  return georgiaCookiesContextPrompt(context);
}
