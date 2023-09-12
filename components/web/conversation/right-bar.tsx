import type { Note as NoteType } from "@prisma/client";
import Note from "@/components/web/conversation/notes";
import TicketDeflected from "@/components/web/conversation/ticket-deflection-checkbox";
import ToReview from "@/components/web/conversation/to-review-checkbox";

export default function SideBar({
  isLoading,
  notes
}: {
  isLoading?: boolean;
  notes?: NoteType[];
}) {
  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="flex-grow space-y-4 px-4 py-6">
        <TicketDeflected />
        <ToReview />
      </div>
      <Note notes={notes} />
    </div>
  );
}

//
