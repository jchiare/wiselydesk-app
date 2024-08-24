import prisma from "@/lib/prisma";
import { TagChat } from "@/lib/chat/tag";
import type { NextRequest } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  const clientApiKey = request.nextUrl.pathname.split("/")[4];

  if (!clientApiKey) return new Response("Missing", { status: 400 });

  let bot =
    process.env.NODE_ENV === "development"
      ? { id: 2 }
      : await prisma.bot.findFirst({
          where: { client_api_key: clientApiKey }
        });

  if (!bot) return new Response("Missing", { status: 404 });

  // Section to get the conversations that will be tagged
  const lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const chatsLastDay = await prisma.conversation.findMany({
    where: {
      bot_id: bot.id,
      created_at: { gte: lastDay },
      tag_id: null
    },
    select: { id: true }
  });

  if (chatsLastDay.length === 0) {
    console.log("No chats to tag");
    return Response.json({ recentlyTaggedChats: [] });
  }

  const chatIds = chatsLastDay.map(chat => chat.id);

  const conversationTagger = new TagChat(bot.id);
  const { taggedChats, batchUpdateSuccessful } =
    await conversationTagger.tagMultipleConversations(chatIds);

  await prisma.$disconnect();
  return Response.json({
    recentlyTaggedChats: taggedChats,
    batchUpdateSuccessful
  });
}
