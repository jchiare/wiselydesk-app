import "server-only";
import prisma from "@/lib/prisma";
import type { ChatTagsResponse, ChatTagsType } from "@/lib/data/chat-tags/type";

export async function getTagsServerSide(
  conversationId: string | number,
  botId: string
): Promise<ChatTagsResponse | { tags: null }> {
  const tags = await prisma.chatTagging.findFirst({
    where: {
      conversation_id:
        typeof conversationId === "string"
          ? parseInt(conversationId, 10)
          : conversationId,
      bot_id: parseInt(botId, 10)
    },
    select: { other: true }
  });

  if (!tags || !tags.other) {
    return {
      tags: null
    };
  }

  const parsedTags = tags.other as ChatTagsType;

  return {
    tags: parsedTags.tags,
    aiGeneratedTags: parsedTags.ai_generated_tags
  };
}
