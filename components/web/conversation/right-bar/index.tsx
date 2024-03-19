import Note from "@/components/web/conversation/right-bar/notes";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function RightBar({
  isLoading,
  ticketDeflected,
  toReview,
  conversationId,
  botId,
  userId,
  publicConversationId,
  zendeskTicketUrl
}: {
  isLoading?: boolean;
  ticketDeflected: boolean | null;
  toReview: boolean | null;
  conversationId: number;
  botId: string;
  userId: number;
  publicConversationId: string;
  zendeskTicketUrl: string | null;
}) {
  const notes = await prisma.note.findMany({
    where: { conversation_id: conversationId }
  });

  const escalation = await prisma.escalation.findFirst({
    where: { conversation_id: conversationId },
    select: { reason: true }
  });

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="flex-grow space-y-4 px-4 py-6">
        {/* <TicketDeflected
          ticketDeflected={ticketDeflected}
          publicConversationId={publicConversationId}
          botId={botId}
        />
        <ToReview
          toReview={toReview}
          publicConversationId={publicConversationId}
          botId={botId}
        /> */}
        <div className="rounded-md border bg-gray-50 p-4">
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
                  <span className="font-semibold">Why escalate: </span>
                  {escalation.reason}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600">No linked Zendesk ticket</p>
          )}
        </div>
      </div>

      <Note
        notes={notes}
        conversationId={conversationId}
        botId={botId}
        userId={userId}
        publicConversationId={publicConversationId}
        isLoading={isLoading}
      />
    </div>
  );
}
