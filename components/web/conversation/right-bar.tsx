import type { Note as NoteType } from "@prisma/client";
import Note from "@/components/web/conversation/notes";
import TicketDeflected from "@/components/web/conversation/ticket-deflection-checkbox";
import ToReview from "@/components/web/conversation/to-review-checkbox";

export default function SideBar({
  isLoading,
  notes,
  ticketDeflected,
  toReview,
  conversationId,
  botId,
  userId,
  publicConversationId
}: {
  isLoading?: boolean;
  notes?: NoteType[];
  ticketDeflected: boolean | null;
  toReview: boolean | null;
  conversationId: number;
  botId: string;
  userId: number;
  publicConversationId: string;
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
