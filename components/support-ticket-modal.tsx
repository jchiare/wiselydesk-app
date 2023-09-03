"use client";
import React, { useState } from "react";
import { URL } from "@/lib/constants";

type SupportTicketModalProps = {
  conversationId: string | undefined;
};

export default function SupportTicketModal({
  conversationId
}: SupportTicketModalProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");

  function handleClick() {
    setIsModalOpen(true);
    if (conversationId) {
      if (!summary) {
        fetch(`${URL}/api/conversation/${conversationId}/summarization`)
          .then((res) => res.json())
          .then((data) => {
            setSummary(data["summary"]);
          });
      }
      if (!transcript) {
        fetch(`${URL}/api/conversation/${conversationId}/transcribe`)
          .then((res) => res.json())
          .then((data) => {
            setTranscript(data["transcription"]);
          });
      }
    } else {
      throw new Error("No Conversation ID ... cant get summarization");
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function submitButton() {
    const formData = {
      email,
      summary,
      transcript
    };

    try {
      const response = await fetch(`${URL}/api/submitSupportTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("Ticket submitted successfully");
        closeModal();
        // Maybe show a success message to the user here
      } else {
        console.error("Failed to submit ticket");
        window.alert("Sorry - Error submitting support ticket");
        // Handle errors, maybe show an error message to the user
      }
    } catch (error) {
      console.error("There was an error submitting the ticket:", error);
      window.alert("Sorry - Error submitting support ticket");
      // Handle the error, maybe show an error message to the user
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Create Support Ticket
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={closeModal}></div>

          <div className="relative z-10 flex h-5/6 w-1/2 flex-col rounded bg-white p-7 text-gray-800 shadow-lg">
            <h2 className="my-1 text-center text-xl text-black">
              Submit a Support Ticket
            </h2>

            <label className="mb-2 block ">
              <span className="pl-1">Email:</span>
              <input
                type="email"
                autoFocus
                name="email"
                placeholder="Enter your email..."
                className="mt-1 w-full rounded border p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="mb-2 flex flex-1 flex-col">
              <span className="pl-1">Summary:</span>
              <textarea
                name="summary"
                value={summary}
                placeholder="Auto generating summary in 3 seconds"
                className="mt-1 w-full flex-1 rounded border p-2"
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>

            <label className="mb-2 block">
              <span className="pl-1">Transcript:</span>
              <textarea
                name="transcript"
                disabled
                value={transcript}
                className="mt-1 h-32 w-full rounded border p-2"
              />
            </label>

            <button
              onClick={submitButton}
              className="float-right mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
