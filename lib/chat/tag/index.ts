import prisma from "@/lib/prisma";
import {
  tagChats,
  MessagesGroupedByConversation,
  TagChatResponse
} from "@/lib/shared/services/analytics/chats/tag";

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
