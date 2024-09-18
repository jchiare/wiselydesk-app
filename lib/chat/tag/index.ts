import prisma from "@/lib/prisma";

import openai from "@/lib/shared/services/openai";
import { TAG_AMBOSS_CHATS } from "@/lib/chat/prompts/tag-category";
import {
  inputCostWithTokens,
  outputCostWithTokens
} from "@/lib/shared/services/openai/cost";
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

const TagChatEvent = z
  .object({
    conversationId: z.string(),
    botId: z.number(),
    cost: z.number().optional()
  })
  .merge(AiResponseEvent);

type TagChatResponse = z.infer<typeof TagChatEvent>;

async function tagChats(
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

export class TagChat {
  private botId: number;
  constructor(botId: number | string) {
    this.botId = typeof botId === "string" ? parseInt(botId, 10) : botId;
  }

  async tagConversation(
    conversationId: number
  ): Promise<TagChatResponse | null> {
    const messages = await prisma.message.findMany({
      where: { conversation_id: conversationId }
    });

    if (messages.length === 0) {
      console.log(
        `Trying to tag conversation. No messages found for conversation ${conversationId}`
      );
      return null;
    }

    const messagesGroupedByConversation: MessagesGroupedByConversation = {
      [conversationId.toString()]: messages.map(message => ({
        text: message.text
      }))
    };

    const taggedChats = await tagChats(
      messagesGroupedByConversation,
      this.botId
    );

    if (taggedChats.length === 0) {
      return null;
    }

    const taggedChat = taggedChats[0];

    await this.saveChatTagging(taggedChat);

    return taggedChat;
  }

  private async saveChatTagging(chat: TagChatResponse): Promise<void> {
    await prisma.$transaction(async prisma => {
      const createdChatTagging = await prisma.chatTagging.create({
        data: {
          bot_id: chat.botId,
          conversation_id: parseInt(chat.conversationId, 10),
          tags: chat.tags.name,
          ai_generated_tags: chat.aiGeneratedTags?.name || undefined,
          cost: chat.cost,
          updated_at: new Date(),
          other: {
            tags: {
              name: chat.tags.name,
              children: chat.tags.children
            },
            ai_generated_tags: chat.aiGeneratedTags && {
              name: chat.aiGeneratedTags.name,
              children: chat.aiGeneratedTags.children
            }
          }
        }
      });

      await prisma.conversation.update({
        where: {
          id: parseInt(chat.conversationId, 10)
        },
        data: {
          tag_id: createdChatTagging.id
        }
      });
    });
  }

  async tagMultipleConversations(conversationIds: number[]): Promise<{
    taggedChats: TagChatResponse[];
    batchUpdateSuccessful: boolean;
  }> {
    const taggedChats: TagChatResponse[] = [];
    let batchUpdateSuccessful = false;

    try {
      for (const conversationId of conversationIds) {
        const taggedChat = await this.tagConversation(conversationId);
        if (taggedChat) {
          taggedChats.push(taggedChat);
        }
      }
      batchUpdateSuccessful = true;
      console.log(`Successfully tagged ${taggedChats.length} chats`);
    } catch (error) {
      console.error("Error updating chats:", error);
    } finally {
      await prisma.$disconnect();
    }

    return {
      taggedChats,
      batchUpdateSuccessful
    };
  }
}
