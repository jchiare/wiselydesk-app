import { anthropic } from "@/lib/shared/services/anthropic";
import { TAG_AMBOSS_ESCALATED_CHATS } from "@/lib/chat/prompts/tag-category";

type GroupedConversation = {
  // assume they are ordered correctly index: number;
  text: string;
};
export type MessagesGroupedByConversation = {
  [conversationId: string]: GroupedConversation[];
};

type Response = {
  conversationId: string;
  tags: string[];
  aiGeneratedTags: string[];
  userTags: string[];
  botId: number;
  tokens: {
    input_tokens: number;
    output_tokens: number;
  };
};

type AiResponse = {
  ai_generated_tags: string[];
  tags: string[];
  user_tags: string[];
};

export async function tagEscalatedChats(
  chats: MessagesGroupedByConversation,
  botId: number
): Promise<Response[]> {
  let taggedChats: Response[] = [];
  const prefilled = '{"ai_generated_tags": [';

  for (const conversationId of Object.keys(chats)) {
    const messages = chats[conversationId];

    const formattedMessages = messages
      .map((message, index) => {
        // AI message
        if (index % 2) {
          return `Message from AI: ${message.text}`;
        }
        return `Message from user: ${message.text}`;
      })
      .join("\n");

    const message = await anthropic.messages.create({
      max_tokens: 100,
      system: TAG_AMBOSS_ESCALATED_CHATS,
      messages: [
        {
          role: "user",
          content: formattedMessages
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

    taggedChats.push({
      conversationId,
      tags: responseText.tags,
      aiGeneratedTags: responseText.ai_generated_tags,
      userTags: responseText.user_tags,
      botId,
      tokens: {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens
      }
    });
  }
  return taggedChats;
}
