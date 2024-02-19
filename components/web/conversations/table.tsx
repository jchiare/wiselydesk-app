"use client";
import { formatDateTime } from "@/lib/shared/utils";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import type { Conversation } from "@prisma/client";
import { useRouter } from "next/navigation";
import useRefreshPage from "@/lib/web/use-refresh-page";

type Conversations = {
  conversations: Conversation[];
};

export default function ConversationTable({ data }: { data: Conversations }) {
  const router = useRouter();
  const { pathname } = useCustomQueryString();

  function goToConversation(id: number) {
    const parts = pathname.split("/");
    parts[parts.length - 1] = id.toString();
    const newPath = parts.join("/");

    router.push(newPath.replace("conversations", "conversation"));
  }

  useRefreshPage(10);

  return data.conversations.map(conversation => (
    <tr
      key={conversation.id}
      onClick={() => goToConversation(conversation.public_id)}
      className="hover:cursor-pointer hover:bg-gray-200">
      <td className={`px-3 py-4 text-sm text-gray-900 `}>
        {conversation.public_id}
      </td>
      <td
        className={`w-[50%] py-4 pl-2 pr-3 text-sm font-medium text-gray-900 `}>
        {conversation.summary}

        <dl className="font-normal lg:hidden">
          <dt className="sr-only">ID</dt>
          <dd className="ml-4 mt-1 truncate text-gray-700">
            {conversation.public_id}
          </dd>
          <dt className="sr-only  sm:hidden">Summary</dt>
          <dd className="mt-1 truncate text-gray-500 sm:hidden">
            {conversation.summary}
          </dd>
        </dl>
      </td>
      <td className={`hidden px-3 py-4 text-sm text-gray-500 sm:table-cell `}>
        Anonymous
      </td>
      <td className={`hidden px-3 py-4 text-sm text-gray-500 lg:table-cell `}>
        {formatDateTime(conversation.created_at)}
      </td>
      <td
        className={`hidden overflow-ellipsis whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell `}>
        {formatDateTime(conversation.created_at)}
      </td>
    </tr>
  ));
}
