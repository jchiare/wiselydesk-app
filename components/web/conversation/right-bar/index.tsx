import type { Note as NoteType } from "@prisma/client";
import Note from "@/components/web/conversation/right-bar/notes";
import TicketDeflected from "@/components/web/conversation/right-bar/ticket-deflection-checkbox";
import ToReview from "@/components/web/conversation/right-bar/to-review-checkbox";
import Link from "next/link";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

async function fetchNotes(publicConversationId: number, botId: string) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${publicConversationId}/notes`,
    {
      cache: "no-cache"
    }
  );

  const json = await res.json();
  return json.notes as NoteType[];
}

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
  const notes = await fetchNotes(conversationId, botId);

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
        <div className="rounded-md border bg-gray-50 p-4">
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
