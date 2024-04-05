import { anthropic } from "@/lib/shared/services/anthropic";
import { TAG_AMBOSS_TICKETS } from "@/lib/chat/prompts/tag-category";
import type { BaseTicket } from "@/types/zendesk-ticket";

type TagTicketResponse = {
  id: number;
  tags: string[];
  ai_generated_tags: string[];
  tokens: {
    input_tokens: number;
    output_tokens: number;
  };
};

type AiResponse = {
  ai_generated_tags: string[];
  tags: string[];
};

export async function tagTickets(
  tickets: BaseTicket[]
): Promise<TagTicketResponse[]> {
  let taggedTickets: TagTicketResponse[] = [];

  for (const ticket of tickets) {
    const prefilled = '{"ai_generated_tags": [';
    const content =
      "Here is the email subject: " +
      ticket.subject +
      "\nHere is the email body:\n" +
      ticket.description;
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
      tokens: { ...usage }
    });
    console.log({
      id: ticket.id,
      tags: responseText.tags,
      ai_generated_tags: responseText.ai_generated_tags,
      tokens: { ...usage }
    });
    await new Promise(resolve => setTimeout(resolve, 500)); // rate limited by anthropic
  }
  return taggedTickets;
}
