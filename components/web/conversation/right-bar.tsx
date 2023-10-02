import type { Note as NoteType } from "@prisma/client";
import Note from "@/components/web/conversation/notes";
import TicketDeflected from "@/components/web/conversation/ticket-deflection-checkbox";
import ToReview from "@/components/web/conversation/to-review-checkbox";
import Link from "next/link";

export default function RightBar({
  isLoading,
  notes,
  ticketDeflected,
  toReview,
  conversationId,
  botId,
  userId,
  publicConversationId,
  zendeskTicketUrl
}: {
  isLoading?: boolean;
  notes?: NoteType[];
  ticketDeflected: boolean | null;
  toReview: boolean | null;
  conversationId: number;
  botId: string;
  userId: number;
  publicConversationId: string;
  zendeskTicketUrl: string | null;
}) {
  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="flex-grow space-y-4 px-4 py-6">
        <TicketDeflected
          ticketDeflected={ticketDeflected}
          publicConversationId={publicConversationId}
          botId={botId}
        />
        <ToReview
          toReview={toReview}
          publicConversationId={publicConversationId}
          botId={botId}
        />
        <div className="bg-grayg-50 rounded-md border p-4">
          {zendeskTicketUrl ? (
            <Link
              href={zendeskTicketUrl}
              target="_blank"
              className="text-blue-500 underline hover:text-blue-700">
              Zendesk Ticket
            </Link>
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

//
