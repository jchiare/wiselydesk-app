"use client";
import { type ChatThemeSettings } from "@/lib/chat/chat-theme";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import { useState } from "react";

type FeedbackProps = {
  isLastMessage: boolean;
  chatTheme: ChatThemeSettings;
  messageId: number | null | undefined;
};

function sendFeedback({
  isHelpful,
  id,
  setPressedThumb
}: {
  isHelpful: boolean;
  id: number | null | undefined;
  setPressedThumb: (arg0: string) => void;
}) {
  setPressedThumb(isHelpful ? "up" : "down"); // Modify the state here
  fetch(`${NEXTJS_BACKEND_URL}/api/message/${id}/is-helpful`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      // secret: process.env.NEXT_PUBLIC_SECRET_API_KEY,
      isHelpful
    })
  })
    .then(res => res.json())
    .then(data => {
      // could maybe show a success message here in the UI.
    });
}

export default function Feedback({
  isLastMessage,
  chatTheme,
  messageId
}: FeedbackProps): JSX.Element | null {
  const [pressedThumb, setPressedThumb] = useState("");
  if (!isLastMessage) return null;

  return (
    <div className="hidden justify-between sm:flex">
      <div className="visible mt-2 flex justify-center gap-3 self-end text-gray-400 md:gap-4 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:translate-x-full lg:gap-1 lg:self-center lg:pl-2">
        <button
          aria-label="Feedback Positive"
          className={`rounded-md p-1 ${chatTheme.assistantMessageSetting.feedbackColour} hover:bg-gray-700 hover:text-gray-200 disabled:hover:text-gray-400`}
          onClick={() =>
            sendFeedback({ isHelpful: true, id: messageId, setPressedThumb })
          }>
          <svg
            stroke="currentColor"
            fill={pressedThumb === "up" ? "white" : "none"}
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </button>
        <button
          aria-label="Feedback Negative"
          className={`rounded-md p-1 ${chatTheme.assistantMessageSetting.feedbackColour} hover:bg-gray-700  hover:text-gray-200 disabled:hover:text-gray-400`}
          onClick={() =>
            sendFeedback({ isHelpful: false, id: messageId, setPressedThumb })
          }>
          <svg
            stroke="currentColor"
            fill={pressedThumb === "down" ? "white" : "none"}
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
