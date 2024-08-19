import prisma from "@/lib/prisma";
import {
  tagChats,
  MessagesGroupedByConversation,
  TagChatResponse
} from "@/lib/shared/services/analytics/chats/tag";
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

  let recentlyTaggedChats;
  let batchUpdateSuccessful = false;
  try {
    recentlyTaggedChats = await tagChats(messagesGroupedByConversation, bot.id);

    const chatTaggingTransactions = recentlyTaggedChats.map(
      (chat: TagChatResponse) => {
        return prisma.chatTagging.create({
          data: {
            bot_id: chat.botId,
            conversation_id: parseInt(chat.conversationId, 10),
            tags: chat.tags.join(","),
            ai_generated_tags: chat.aiGeneratedTags?.join(",") || undefined,
            user_tags: chat.userTags?.join(",") || undefined,
            cost: chat.cost,
            updated_at: new Date()
          }
        });
      }
    );
    const createdChatTaggings = await prisma.$transaction(
      chatTaggingTransactions
    );

    const conversationTransactions = recentlyTaggedChats.map(
      (chat: TagChatResponse, index: number) => {
        return prisma.conversation.update({
          where: {
            id: parseInt(chat.conversationId, 10)
          },
          data: {
            tag_id: createdChatTaggings.find(
              tag => tag.conversation_id === parseInt(chat.conversationId, 10)
            )?.id
          }
        });
      }
    );
    await prisma.$transaction(conversationTransactions);
    batchUpdateSuccessful = true;
    console.log(`Successfully tagged ${recentlyTaggedChats.length} chats`);
  } catch (error) {
    console.error("Error updating chats:", error);
  } finally {
    await prisma.$disconnect();
    return Response.json({
      recentlyTaggedChats,
      batchUpdateSuccessful
    });
  }
}
