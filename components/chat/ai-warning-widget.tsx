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
    <div
      className="relative flex w-fit items-center hover:cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>
      <svg
        width="90"
        height="25"
        viewBox="0 0 90 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="90" height="25" rx="4" fill="#475569"></rect>
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="15"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600">
          AI {getText(account)["aiWarning"][locale]}
        </text>
      </svg>
      {showTooltip && (
        <div className="absolute bottom-10 left-[-35px] mt-6 w-[300px] rounded bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-md">
          {getText(account)["aiWarningExplanation"][locale]}
        </div>
      )}
    </div>
  );
}
