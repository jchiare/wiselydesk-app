"use client";

import { useRouter, usePathname } from "next/navigation";

export function NavigationButtons({
  hasNextConversation
}: {
  hasNextConversation: boolean;
}) {
  const router = useRouter();
  const url = usePathname();
  const urlWithoutId = url.split("/").slice(0, -1).join("/");
  const conversationId = parseInt(url.split("/").slice(-1)[0]);

  return (
    <div className="mr-2 mt-3 flex justify-end gap-3">
      <button
        className="flex w-fit items-center gap-1 rounded bg-orange-200 px-2 py-1 shadow-md hover:cursor-pointer hover:bg-[#f4b88d] active:translate-y-[0.03em] active:shadow-sm"
        onClick={() => router.push(`${urlWithoutId}/${conversationId - 1}`)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Previous
      </button>

      <button
        disabled={!hasNextConversation}
        className={`flex w-fit items-center gap-1 rounded bg-orange-200 px-2 py-1 shadow-md hover:bg-[#f4b88d] active:translate-y-[0.03em] active:shadow-sm ${
          !hasNextConversation
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-orange-300"
        }`}
        title={hasNextConversation ? "Next" : "No next conversation"}
        onClick={() => router.push(`${urlWithoutId}/${conversationId + 1}`)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
        Next
      </button>
    </div>
  );
}
