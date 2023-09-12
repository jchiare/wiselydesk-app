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
    <div className="flex flex-col space-y-4">
      <TicketDeflected />
      <ToReview />
      <Note notes={notes} />
    </div>
  );
}

//
