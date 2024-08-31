import Note from "@/components/web/conversation/right-bar/notes";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Tags } from "@/components/web/conversation/right-bar/tags";
import { NavigationButtons } from "@/components/web/conversation/right-bar/navigation";
import { getTagsServerSide } from "@/lib/data/chat-tags/server";

export async function RightBar({
  isLoading,
  conversationId,
  botId,
  userId,
  publicConversationId,
  zendeskTicketUrl
}: {
  isLoading?: boolean;
  toReview: boolean | null;
  conversationId: number;
  botId: string;
  userId: number;
  publicConversationId: number;
  zendeskTicketUrl: string | null;
}) {
  const notes = await prisma.note.findMany({
    where: { conversation_id: conversationId }
  });

  const escalation = await prisma.escalation.findFirst({
    where: { conversation_id: conversationId },
    select: { reason: true }
  });

  const hasNextConversation = await prisma.conversation.findFirst({
    where: {
      public_id: publicConversationId + 1,
      bot_id: parseInt(botId, 10)
    },
    select: { id: true }
  });

  const tags = await getTagsServerSide(conversationId, botId);

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <NavigationButtons hasNextConversation={!!hasNextConversation} />
      <div className="flex-grow space-y-4 px-4 pb-6">
        <div className="rounded-md border bg-gray-100 p-4">
          {zendeskTicketUrl ? (
            <>
              <Link
                href={zendeskTicketUrl}
                target="_blank"
                className="text-blue-500 underline hover:text-blue-700">
                Zendesk Ticket
              </Link>
              {escalation && (
                <p>
                  <span className="font-semibold">Why escalated: </span>
                  {escalation.reason}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600">No linked Zendesk ticket</p>
          )}
        </div>

        <div className="rounded-md border bg-gray-50 p-4">
          <Tags
            tags={tags}
            conversationId={conversationId}
            isLoading={isLoading}
            botId={botId}
          />
        </div>
      </div>
      <div className="hidden sm:block">
        <Note
          notes={notes}
          conversationId={conversationId}
          botId={botId}
          userId={userId}
          publicConversationId={publicConversationId}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
