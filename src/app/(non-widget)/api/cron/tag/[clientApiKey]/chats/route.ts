import prisma from "@/lib/prisma";
import {
  tagChats,
  MessagesGroupedByConversation
} from "@/lib/shared/services/analytics/chats/tag";
import type { NextRequest } from "next/server";

export const maxDuration = 75;
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

  const lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const chatsLastDay = await prisma.conversation.findMany({
    where: {
      bot_id: bot.id,
      created_at: { gte: lastDay }
    }
  });

  if (chatsLastDay.length === 0) {
    return Response.json({ chats: 0 });
  }

  const chatIds = chatsLastDay.map(chat => chat.id);
  const messages = await prisma.message.findMany({
    where: { conversation_id: { in: chatIds } }
  });

  const messagesGroupedByConversation: MessagesGroupedByConversation = {};

  for (const message of messages) {
    const conversationId = message.conversation_id;
    if (!messagesGroupedByConversation[conversationId]) {
      messagesGroupedByConversation[conversationId] = [];
    }

    messagesGroupedByConversation[conversationId].push({
      text: message.text
    });
  }

  // update escalation table addings tags
  let taggedChats;

  try {
    taggedChats = await tagChats(messagesGroupedByConversation, bot.id);

    console.log(taggedChats);

    const updatePromises = taggedChats.map(
      (chat: { conversationId: string; tags: any[] }) => {
        return prisma.escalation.update({
          where: {
            conversation_id: parseInt(chat.conversationId, 10)
          },
          data: {
            tags: chat.tags.join(",")
          }
        });
      }
    );

    await prisma.$transaction(updatePromises);

    console.log("Batch update successful");
  } catch (error) {
    console.error("Error updating escalations:", error);
  } finally {
    await prisma.$disconnect();
    return Response.json({
      taggedChats
    });
  }
}
