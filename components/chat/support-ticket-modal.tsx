"use client";
import React, { useState } from "react";
import { URL, NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import { useLocalStorage } from "@/lib/chat/hooks/use-local-storage";

type SupportTicketModalProps = {
  conversationId: string | undefined;
  botId: number;
  locale?: string;
};

export default function SupportTicketModal({
  conversationId,
  botId,
  locale
}: SupportTicketModalProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [additionalInfo, setAdditionalInfo] = useLocalStorage<string>(
    "savedAdditionalInfo",
    ""
  );
  const [email, setEmail] = useLocalStorage<string>("savedEmail", "");
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);

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
    setIsLoading(true);
    const formData = {
      email,
      summary,
      transcript,
      additionalInfo,
      locale
    };

    try {
      const response = await fetch(
        `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${conversationId}/submit-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        console.log("Ticket submitted successfully");
        setSubmitSuccess(true);
        setTimeout(() => {
          closeModal();
          setSubmitSuccess(false);
          localStorage.removeItem("savedAdditionalInfo");
          setTicketCreated(true);
          setAdditionalInfo("");
        }, 2100);
      } else {
        console.error("Failed to submit ticket");
        window.alert("Sorry - Error submitting support ticket");
        // Handle errors, maybe show an error message to the user
      }
    } catch (error) {
      console.error("There was an error submitting the ticket:", error);
      window.alert("Sorry - Error submitting support ticket");
      // Handle the error, maybe show an error message to the user
    } finally {
      setIsLoading(false); //
    }
  }

  return (
    <div className="relative ">
      <button
        aria-label="Create Support Ticket"
        onClick={handleClick}
        disabled={ticketCreated}
        className={`rounded ${
          ticketCreated ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
        } px-4 py-2 font-bold text-white transition-colors duration-300 `}>
        {ticketCreated ? "Support Ticket Created" : "Create Support Ticket"}
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
                autoFocus={email.length === 0}
                name="email"
                value={email}
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
                autoFocus={email.length > 0}
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
              disabled={isLoading || submitSuccess}
              className={`mx-auto mt-4 w-fit rounded px-4 py-2 font-bold text-white transition-colors duration-300 ${
                submitSuccess ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
              }`}>
              {submitSuccess ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true">
                    <path d="M20.285 2l-11.285 11.567-5.286-4.745-3.714 4.161 9 8.017 15-15.426-4.715-3.574z" />
                  </svg>
                  Successfully created support ticket
                </span>
              ) : isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.002 7.938l1.272-1.272-.536-.375z"></path>
                  </svg>
                  Creating support ticket
                </span>
              ) : (
                "Submit support ticket"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
