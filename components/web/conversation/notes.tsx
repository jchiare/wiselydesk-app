"use client";

import { useState } from "react";
import { Note } from "@prisma/client";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

type NotesProps = {
  isLoading?: boolean;
  notes?: Note[];
  conversationId: number;
  botId: string;
  userId: number;
  publicConversationId: string;
};

export default function ConversationNote({
  isLoading,
  notes,
  conversationId,
  botId,
  userId,
  publicConversationId
}: NotesProps) {
  // Local state to hold the new note content
  const [newNote, setNewNote] = useState("");

  const handleAddNote = async () => {
    try {
      const response = await fetch(
        `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${publicConversationId}/notes`,
        {
          method: "POST", // Updated method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, content: newNote, conversationId })
        }
      );
      if (response.ok) {
        console.log("Added notes");
      } else {
        const json = await response.json();
        console.error(`Error: ${json.message}`);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
    setNewNote(""); // Clear the note input
  };

  return (
    <div className="my-6 bg-slate-100 px-2 py-4">
      <h2 className="mb-2 font-semibold">Notes</h2>
      <ul>
        {!notes || notes.length === 0 ? (
          <li key={"first"} className="mb-2 rounded-sm bg-slate-50 p-1 text-sm">
            {"No Notes"}
          </li>
        ) : (
          notes.map((note, index) => (
            <li key={index} className="mb-2 text-sm">
              {note.content}
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 flex flex-col items-center">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="mt-1 w-full flex-1 rounded border p-2"
          placeholder="New note"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleAddNote}
          className="mt-2 w-fit transform rounded bg-blue-500 p-2 text-white active:translate-x-[0.5px] active:translate-y-[0.5px] active:bg-blue-700">
          Add Note
        </button>
      </div>
    </div>
  );
}
