"use client";
import React, { useState } from "react";
import { URL } from "@/lib/shared/constants";

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
  const [additionalInfo, setAdditionalInfo] = useState("");

  function handleClick() {
    setIsModalOpen(true);
    if (conversationId) {
      console.log("convo ID: ", conversationId);
      if (!summary) {
        fetch(`${URL}/api/conversation/${conversationId}/summarization`)
          .then((res) => res.json())
          .then((data) => {
            setSummary(data["summary"]);
            console.log("summary: ", data["summary"]);
          });
      }
      if (!transcript) {
        fetch(`${URL}/api/conversation/${conversationId}/transcribe`)
          .then((res) => res.json())
          .then((data) => {
            setTranscript(data["transcription"]);
            console.log("transcriptin: ", data["transcription"]);
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
      transcript,
      additionalInfo
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
        aria-label="Create Support Ticket"
        onClick={handleClick}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Create Support Ticket
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={closeModal}></div>

          <div className="relative z-10 flex h-fit w-1/3 flex-col rounded bg-white p-7 text-gray-800 shadow-lg">
            <label className="mb-2 block ">
              <span className="pl-1">AMBOSS account email:</span>
              <input
                type="email"
                autoFocus
                name="email"
                placeholder="Enter your AMBOSS account email ..."
                className="mt-1 w-full rounded border p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="mb-2 flex flex-col">
              <span className="pl-1">Additional info:</span>
              <textarea
                name="additional-info"
                value={additionalInfo}
                rows={3}
                placeholder="Let us know anything else here ..."
                className="mt-1 w-full rounded border p-2"
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </label>

            {/* <label className="mb-2 flex flex-1 flex-col">
              <span className="pl-1">Summary:</span>
              <textarea
                name="summary"
                value={summary}
                placeholder="Auto generating summary in 3 seconds"
                className="mt-1 w-full flex-1 rounded border bg-gray-100 p-2 hover:bg-white"
                onChange={(e) => setSummary(e.target.value)}
              />
            </label> */}
            {/* 
            <label className="mb-2 block">
              <span className="pl-1">Transcript:</span>
              <textarea
                name="transcript"
                disabled
                value={transcript}
                className="mt-1 h-32 w-full rounded border p-2"
              />
            </label> */}

            <i className="text-center text-sm font-normal">
              AI summary and transcript automatically included
            </i>

            <button
              onClick={submitButton}
              className="mx-auto mt-4 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Submit support ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
