import { anthropic } from "@/lib/shared/services/anthropic";
import { TAG_AMBOSS_TICKETS_SYSTEM_PROMPT_FREE_ACCESS } from "@/lib/chat/prompts/tag-category";
import type { BaseTicket } from "@/types/zendesk-ticket";

export async function filterFreeAmbossTickets(
  tickets: BaseTicket[]
): Promise<number[]> {
  let ticketIds: number[] = [];

  for (const ticket of tickets) {
    const isFreeInTicket =
      ticket.description.toLowerCase().includes("free") ||
      (ticket.subject && ticket.subject.toLowerCase().includes("free"));

    if (isFreeInTicket) {
      const content = ticket.subject + "\n\n" + ticket.description;
      const message = await anthropic.messages.create({
        max_tokens: 100,
        system: TAG_AMBOSS_TICKETS_SYSTEM_PROMPT_FREE_ACCESS,
        messages: [
          {
            role: "user",
            content
          }
        ],
        model: "claude-3-haiku-20240307",
        temperature: 0
      });

      const responseText = message.content[0].text;
      console.log(
        `Received response from anthropic: "${responseText}" for content: "${content.trim()}"`
      );

      if (message.content[0].text === "free_access_request") {
        ticketIds.push(ticket.id);
      }
    }
  }
  return ticketIds;
}
