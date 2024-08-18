import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { fetchServerSession } from "@/lib/auth";
import { orgChooser } from "@/lib/org-chooser";

export default async function ConversationFinder({
  params
}: {
  params: { conversationId: string };
}) {
  const session = await fetchServerSession();
  const orgId = orgChooser(session);

  const { conversationId } = params;
  const conversation = await prisma.conversation.findFirst({
    where: { id: parseInt(conversationId, 10) },
    select: {
      public_id: true,
      bot_id: true
    }
  });

  if (!conversation) {
    console.error(
      "Conversation not found for redirect with conversation ID",
      conversationId
    );
    throw new Error("Error");
  }

  const bot = await prisma.bot.findFirst({
    where: { id: conversation.bot_id },
    select: { organization_id: true }
  });

  if (!bot) {
    console.error(
      "Bot not found for redirect with conversation ID",
      conversationId
    );
    throw new Error("Error");
  }

  if (orgId !== 2 && bot.organization_id !== orgId) {
    return <div>You do not have permission to access this conversation</div>;
  }

  return redirect(
    `/bot/${conversation.bot_id}/conversation/${conversation.public_id}`
  );
}
