"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const WISELYDESK_SESSION_ID = "wiselydesk_visitor_session_id";

export async function identifyVisitor(botId: number) {
  let visitorSessionId = cookies().get(WISELYDESK_SESSION_ID)?.value;
  if (!visitorSessionId) {
    visitorSessionId = crypto.randomUUID();
    cookies().set(WISELYDESK_SESSION_ID, visitorSessionId, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      maxAge: 86400 * 30 // 30 days
    });
    await prisma.widgetSession.create({
      data: {
        sessionId: visitorSessionId,
        botId
      }
    });
  }
  return visitorSessionId;
}

export async function getVisitorSessionId() {
  return cookies().get(WISELYDESK_SESSION_ID)?.value;
}

export async function getLastConversationId(sessionId: string) {
  return await prisma.conversation.findFirst({
    where: { widgetSessionId: sessionId },
    orderBy: { created_at: "desc" },
    select: { id: true }
  });
}

export async function getMessagesFromConversationId(conversationId: number) {
  return await prisma.message.findMany({
    where: { conversation_id: conversationId }
  });
}
