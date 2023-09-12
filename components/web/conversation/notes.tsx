"use client";

import { useState } from "react";
import { Note } from "@prisma/client";

type NotesProps = {
  notes?: Note[];
};

export default function ConversationNote({ notes }: NotesProps) {
  // Local state to hold the new note content
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    // Your logic to add a new note could go here
    // e.g., an API call to save the note

    setNewNote(""); // Clear the note input
  };

  return (
    <div className="mt-6 bg-slate-50 px-2 py-4">
      <h2 className="font-semibold">Notes</h2>
      <ul>
        {notes?.map((note, index) => (
          <li key={index} className="mb-2 text-sm">
            {note.content}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="mt-1 w-full flex-1 rounded border p-2"
          placeholder="New note"
          rows={3}
        />
        <button
          onClick={handleAddNote}
          className="mt-2 rounded bg-blue-500 p-2 text-white">
          Add Note
        </button>
      </div>
    </div>
  );
}
