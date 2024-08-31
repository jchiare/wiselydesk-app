import { TagChat } from "@/lib/chat/tag";
import { getTagsServerSide } from "@/lib/data/chat-tags/server";

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

  const tags = await getTagsServerSide(conversationId, botId);

  return Response.json(tags, { status: 200 });
}
