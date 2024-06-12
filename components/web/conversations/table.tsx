"use client";
import { formatDateTime } from "@/lib/shared/utils";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import { useRouter } from "next/navigation";
import useRefreshPage from "@/lib/web/use-refresh-page";
import type { ConversationDTO } from "@/src/app/(non-widget)/api/bot/[id]/conversations/route";

export function truncateSummary(
  summary: string | null,
  truncateLength = 115
): string {
  if (!summary) return "";
  return summary.length > truncateLength
    ? `${summary.slice(0, truncateLength)}...`
    : summary;
}

export default function ConversationTable({
  data,
  filter
}: {
  data: ConversationDTO;
  filter: string;
}) {
  const router = useRouter();
  const { pathname } = useCustomQueryString();

  function goToConversation(id: number) {
    const parts = pathname.split("/");
    parts[parts.length - 1] = id.toString();
    const newPath = parts.join("/");

    router.push(newPath.replace("conversations", "conversation"));
  }

  useRefreshPage(30);

  if (!data.conversations || data.conversations.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-3 py-4 text-sm text-gray-900 ">
          No conversations found
        </td>
      </tr>
    );
  }

  return data.conversations.map(conversation => (
    <tr
      key={conversation.id}
      onClick={() => goToConversation(conversation.public_id)}
      className="hover:cursor-pointer hover:bg-gray-200">
      <td className={`hidden px-3 py-4 text-sm text-gray-900 sm:table-cell `}>
        {conversation.public_id}
      </td>
      <td
        className={`hidden w-[50%] py-4 pl-2 pr-3 text-sm font-medium text-gray-900 sm:table-cell`}>
        {truncateSummary(conversation.summary)}
      </td>
      <td
        className={`table-cell w-[45%] py-4 pl-2 pr-3 text-sm font-medium text-gray-900 sm:hidden`}>
        {truncateSummary(conversation.summary, 75)}
      </td>
      <td className={`hidden px-3 py-4 text-sm text-gray-500 sm:table-cell `}>
        {filter === "escalated"
          ? conversation.escalatedReason
          : conversation.escalated
          ? "Yes"
          : ""}
      </td>
      <td className={`hidden px-3 py-4 text-sm text-gray-500 lg:table-cell `}>
        {conversation.rating === null
          ? ""
          : conversation.rating
          ? "Positive"
          : "Negative"}
      </td>
      <td
        className={` table-cell overflow-ellipsis whitespace-nowrap px-3 py-4 text-sm text-gray-500 `}>
        {formatDateTime(conversation.created_at)}
      </td>
    </tr>
  ));
}
