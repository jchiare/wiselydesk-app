import openai from "@/lib/shared/services/openai";
import { TAG_AMBOSS_CHATS } from "@/lib/chat/prompts/tag-category";
import { inputCostWithTokens, outputCostWithTokens } from "../../openai/cost";

type GroupedConversation = {
  // assume they are ordered correctly index: number;
  text: string;
};
export type MessagesGroupedByConversation = {
  [conversationId: string]: GroupedConversation[];
};

export type TagChatResponse = {
  conversationId: string;
  tags: string[];
  aiGeneratedTags: string[];
  userTags: string[];
  botId: number;
  cost: number | undefined;
};

type AiResponse = {
  ai_generated_tags: string[];
  tags: string[];
  user_tags: string[];
};

export async function tagChats(
  chats: MessagesGroupedByConversation,
  botId: number,
  model = "gpt-4o"
): Promise<TagChatResponse[]> {
  let taggedChats: TagChatResponse[] = [];

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

    const message = await openai.chat.completions.create({
      messages: [
        { role: "system", content: TAG_AMBOSS_CHATS },
        {
          role: "user",
          content: `Here are the messages from chat: ${formattedMessages}`
        }
      ],
      model,
      response_format: { type: "json_object" }
    });

    // const usage = message.usage;
    const unparsedResponseText = message.choices[0].message.content;
    if (!unparsedResponseText) {
      throw new Error(`No response from openai tagChats`);
    }

    const responseText = JSON.parse(unparsedResponseText) as AiResponse;
    const cost =
      inputCostWithTokens(message.usage?.prompt_tokens, model) +
      outputCostWithTokens(message.usage?.completion_tokens, model);

    taggedChats.push({
      conversationId,
      tags: responseText.tags,
      aiGeneratedTags: responseText.ai_generated_tags,
      userTags: responseText.user_tags,
      botId,
      cost
    });
  }
  return taggedChats;
}
