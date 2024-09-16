import "server-only";
import prisma from "@/lib/prisma";
import type { ChatTagsType } from "@/lib/data/chat-tags/type";

export async function getTagsServerSide(
  conversationId: string | number,
  botId: string
): Promise<ChatTagsType | { tags: null }> {
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

  // @ts-expect-error
  const parsedTags = JSON.parse(tags.other) as ChatTagsType;

  return {
    tags: parsedTags.tags,
    ai_generated_tags: tags.ai_generated_tags
  };
}
