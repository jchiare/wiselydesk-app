import type { Note as NoteType } from "@prisma/client";
import Note from "@/components/web/conversation/notes";
import TicketDeflected from "@/components/web/conversation/ticket-deflection-checkbox";
import ToReview from "@/components/web/conversation/to-review-checkbox";

export default function SideBar({
  isLoading,
  notes,
  ticketDeflected,
  toReview,
  conversationId
}: {
  isLoading?: boolean;
  notes?: NoteType[];
  ticketDeflected: boolean | null;
  toReview: boolean | null;
  conversationId: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="flex-grow space-y-4 px-4 py-6">
        <TicketDeflected
          ticketDeflected={ticketDeflected}
          conversationId={conversationId}
        />
        <ToReview toReview={toReview} conversationId={conversationId} />
      </div>
      <Note notes={notes} />
    </div>
  );
}

//
