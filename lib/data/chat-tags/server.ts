import "server-only";
import prisma from "@/lib/prisma";
import { formatChatTags } from "@/lib/data/chat-tags/helper";

export type ChatTagsType = Awaited<ReturnType<typeof getTagsServerSide>>;

export async function getTagsServerSide(
  conversationId: string | number,
  botId: string
) {
  const tags = await prisma.chatTagging.findFirst({
    where: {
      conversation_id:
        typeof conversationId === "string"
          ? parseInt(conversationId, 10)
          : conversationId,
      bot_id: parseInt(botId, 10)
    },
    select: { tags: true, ai_generated_tags: true, user_tags: true }
  });
  if (!tags) {
    return {
      tags: null
    };
  }

  return {
    tags: formatChatTags(tags.tags),
    aiGeneratedTags: formatChatTags(tags.ai_generated_tags),
    userTags: formatChatTags(tags.user_tags)
  };
}
