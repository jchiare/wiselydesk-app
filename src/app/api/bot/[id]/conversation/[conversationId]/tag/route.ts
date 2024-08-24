import { TagChat } from "@/lib/chat/tag";
import prisma from "@/lib/prisma";

type Params = {
  params: { conversationId: string; id: string };
};

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: Params) {
  const { conversationId, id: botId } = params;

  const tagChatService = new TagChat(botId);
  const tags = await tagChatService.tagConversation(
    parseInt(conversationId, 10)
  );

  if (!tags) {
    return Response.json({ tags: null }, { status: 200 });
  }

  return Response.json(
    {
      tags: tags.tags,
      ai_generated_tags: tags.aiGeneratedTags,
      user_tags: tags.userTags
    },
    { status: 200 }
  );
}

export async function GET(request: Request, { params }: Params) {
  const { conversationId, id: botId } = params;

  const chatTagging = await prisma.chatTagging.findFirst({
    where: {
      conversation_id: parseInt(conversationId, 10),
      bot_id: parseInt(botId, 10)
    },
    select: {
      tags: true,
      ai_generated_tags: true,
      user_tags: true
    }
  });

  if (!chatTagging) {
    return Response.json({ tags: null }, { status: 200 });
  }

  return Response.json(
    {
      tags: chatTagging.tags,
      ai_generated_tags: chatTagging.ai_generated_tags,
      user_tags: chatTagging.user_tags
    },
    { status: 200 }
  );
}
