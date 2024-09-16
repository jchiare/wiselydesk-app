import openai from "@/lib/shared/services/openai";
import { TAG_AMBOSS_CHATS } from "@/lib/chat/prompts/tag-category";
import { inputCostWithTokens, outputCostWithTokens } from "../../openai/cost";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

type GroupedConversation = {
  // assume they are ordered correctly index: number;
  text: string;
};
export type MessagesGroupedByConversation = {
  [conversationId: string]: GroupedConversation[];
};

const tagValue = z.object({
  name: z.string(),
  children: z.array(z.string())
});

const AiResponseEvent = z.object({
  tags: tagValue,
  aiGeneratedTags: tagValue
});

export const TagChatEvent = z
  .object({
    conversationId: z.string(),
    botId: z.number(),
    cost: z.number().optional()
  })
  .merge(AiResponseEvent);

export type TagChatResponse = z.infer<typeof TagChatEvent>;

export async function tagChats(
  chats: MessagesGroupedByConversation,
  botId: number,
  model = "gpt-4o-2024-08-06"
): Promise<TagChatResponse[]> {
  let taggedChats: TagChatResponse[] = [];

  for (const conversationId of Object.keys(chats)) {
    const messages = chats[conversationId];

    const formattedMessages = messages
      .map((message, index) => {
        // AI message
        if (index % 2 === 0) {
          return `Message from AI: ${message.text}`;
        }
        return `Message from user: ${message.text}`;
      })
      .join("\n");

    console.log("Formmated Messsages: ", formattedMessages);

    const message = await openai.beta.chat.completions.parse({
      messages: [
        { role: "system", content: TAG_AMBOSS_CHATS },
        {
          role: "user",
          content: `Here are the messages from chat: ${formattedMessages}`
        }
      ],
      model,
      response_format: zodResponseFormat(AiResponseEvent, "event"),
      temperature: 0.0
    });

    const responseText = message.choices[0].message.parsed;
    console.log("Response Text: ", responseText);
    if (!responseText) {
      throw new Error(`No response from openai tagChats`);
    }

    const cost =
      inputCostWithTokens(message.usage?.prompt_tokens, model) +
      outputCostWithTokens(message.usage?.completion_tokens, model);

    taggedChats.push({
      conversationId,
      tags: responseText.tags,
      aiGeneratedTags: responseText.aiGeneratedTags,
      botId,
      cost: parseFloat(cost.toFixed(4))
    });
  }
  return taggedChats;
}
