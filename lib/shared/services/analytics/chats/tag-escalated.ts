import openai from "@/lib/shared/services/openai";
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
    input_tokens: number | undefined;
    output_tokens: number | undefined;
  };
};

type AiResponse = {
  ai_generated_tags: string[];
  tags: string[];
  user_tags: string[];
};

const excludedConversations = ["4399", "4402"];
export async function createTagsEscalatedChats(
  chats: MessagesGroupedByConversation,
  botId: number
): Promise<Response[]> {
  let taggedChats: Response[] = [];

  for (const conversationId of Object.keys(chats)) {
    if (excludedConversations.includes(conversationId)) {
      continue;
    }
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

    const message = await openai.chat.completions.create({
      messages: [
        { role: "system", content: TAG_AMBOSS_ESCALATED_CHATS },
        {
          role: "user",
          content: `Here are the messages from chat: ${formattedMessages}`
        }
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" }
    });

    // const usage = message.usage;
    const unparsedResponseText = message.choices[0].message.content;
    if (!unparsedResponseText) {
      throw new Error(`No response from openai createTagsEscalatedChats`);
    }

    const responseText = JSON.parse(unparsedResponseText) as AiResponse;

    taggedChats.push({
      conversationId,
      tags: responseText.tags,
      aiGeneratedTags: responseText.ai_generated_tags,
      userTags: responseText.user_tags,
      botId,
      tokens: {
        input_tokens: message.usage?.prompt_tokens,
        output_tokens: message.usage?.completion_tokens
      }
    });
  }
  return taggedChats;
}
