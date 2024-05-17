import prisma from "@/lib/prisma";
import { tagEscalatedChats } from "@/lib/shared/services/analytics/chats/tag-escalated";
import type { NextRequest } from "next/server";
import type { MessagesGroupedByConversation } from "@/lib/shared/services/analytics/chats/tag-escalated";

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

  const bot = await prisma.bot.findFirst({
    where: { client_api_key: clientApiKey }
  });
  if (!bot) return new Response("Missing", { status: 404 });

  const escalatedChatsLastDay = await prisma.conversation.findMany({
    where: {
      bot_id: bot.id,
      created_at: { gte: new Date(new Date().getTime() - 60 * 60 * 60 * 1000) },
      escalated: true
    }
  });

  // If there are no escalated tickets in the last day, return early
  if (escalatedChatsLastDay.length === 0) {
    return Response.json({ escalated: 0 });
  }

  const escalatedTicketIds = escalatedChatsLastDay.map(chat => chat.id);
  const messages = await prisma.message.findMany({
    where: { conversation_id: { in: escalatedTicketIds } }
  });

  let messagesGroupedByConversation: MessagesGroupedByConversation = {};

  for (const message of messages) {
    if (!messagesGroupedByConversation[message.conversation_id]) {
      messagesGroupedByConversation[message.conversation_id] = [];
    }

    messagesGroupedByConversation[message.conversation_id].push({
      text: message.text
    });
  }

  const taggedChats = await tagEscalatedChats(
    messagesGroupedByConversation,
    bot.id
  );

  return Response.json({
    taggedChats
  });
}
