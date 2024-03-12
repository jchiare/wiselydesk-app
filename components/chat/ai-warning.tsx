"use client";
import { useState } from "react";
import getText from "@/lib/i18n/chat";

type AiWarningProps = {
  locale: "en" | "de";
  account: string | undefined;
};

export default function AiWarning({ locale, account }: AiWarningProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!account) return null;
  return (
    <>
      <hr />
      <div className="flex justify-between p-2">
        <div className="flex flex-row items-center gap-2">
          <svg
            width="16"
            height="15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="16" height="14" rx="4" fill="#737373"></rect>
            <path
              d="M6.181 11.1H7.9L6.142 4.9H4.213L2.46 11.1h1.564l.297-1.362h1.572l.288 1.362zM5.077 6.296h.082l.49 2.307h-1.08l.508-2.307zm7.635 4.804V9.832h-1.306V6.167h1.306V4.899H8.527v1.268h1.307v3.665H8.527V11.1h4.185z"
              fill="#fff"></path>
          </svg>
          <span>{getText(account)["aiWarning"][locale]}</span>
        </div>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6 hover:cursor-help">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          {showTooltip && (
            <div className="absolute bottom-10 left-0 mt-6 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-md">
              {getText(account)["aiWarningExplanation"][locale]}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
