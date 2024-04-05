import { anthropic } from "@/lib/shared/services/anthropic";
import { TAG_AMBOSS_TICKETS } from "@/lib/chat/prompts/tag-category";
import type { BaseTicket } from "@/types/zendesk-ticket";

type TagTicketResponse = {
  id: number;
  tags: string[];
  ai_generated_tags: string[];
  zendesk_tags: string[];
  ticket_description: string;
  tokens: {
    input_tokens: number;
    output_tokens: number;
  };
};

type AiResponse = {
  ai_generated_tags: string[];
  tags: string[];
};

const EMAIL_FORWARD_REGEX =
  /On\s\w{1,3},\s\w{1,4}\s\d{1,2},\s20\d{2},\s\d{1,2}:\d{1,2}\s(AM|PM|am|pm)\sAMBOSS\s<.*>\swrote:.*/gs;

export async function tagTickets(
  tickets: BaseTicket[]
): Promise<TagTicketResponse[]> {
  let taggedTickets: TagTicketResponse[] = [];

  for (const ticket of tickets) {
    const prefilled = '{"ai_generated_tags": [';
    const ticketDescription = ticket.description
      .replace(EMAIL_FORWARD_REGEX, "")
      .replaceAll("\n", "");
    const content =
      "Here is the email subject: " +
      ticket.subject +
      "\nHere is the email body:\n" +
      ticketDescription;
    const message = await anthropic.messages.create({
      max_tokens: 100,
      system: TAG_AMBOSS_TICKETS,
      messages: [
        {
          role: "user",
          content
        },
        {
          role: "assistant",
          content: prefilled
        }
      ],
      model: "claude-3-sonnet-20240229",
      temperature: 0
    });

    const usage = message.usage;
    const responseText = JSON.parse(
      prefilled + message.content[0].text
    ) as AiResponse;
    taggedTickets.push({
      id: ticket.id,
      tags: responseText.tags,
      ai_generated_tags: responseText.ai_generated_tags,
      zendesk_tags: ticket.tags,
      ticket_description: ticketDescription,
      tokens: { ...usage }
    });
    await new Promise(resolve => setTimeout(resolve, 500)); // rate limited by anthropic
  }
  return taggedTickets;
}
