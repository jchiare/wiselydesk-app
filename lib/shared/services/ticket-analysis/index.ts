import { anthropic } from "@/lib/shared/services/anthropic";
import { TAG_AMBOSS_TICKETS_SYSTEM_PROMPT } from "@/lib/chat/prompts/tag-category";
import type { BaseTicket } from "@/types/zendesk-ticket";

export async function filterFreeAmbossTickets(
  tickets: BaseTicket[]
): Promise<number[]> {
  let ticketIds: number[] = [];
  for (const ticket of tickets) {
    const isFreeInDescription = ticket.description.includes("free");
    if (isFreeInDescription) {
      const message = await anthropic.messages.create({
        max_tokens: 100,
        system: TAG_AMBOSS_TICKETS_SYSTEM_PROMPT,
        messages: [],
        model: "claude-3-haiku-20240307",
        temperature: 0
      });
      if (message.content[0].text === "free_access_request") {
        ticketIds.push(ticket.id);
      }
    }
  }
  return ticketIds;
  // get text
}
