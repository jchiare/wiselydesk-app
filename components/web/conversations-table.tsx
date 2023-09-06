"use client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { URL } from "@/lib/shared/constants";
import { formatUnixTimestamp } from "@/lib/shared/utils";
import { orgChooser } from "@/lib/shared/orgChooser";
import type { Conversation } from "@prisma/client";
import type { Session } from "next-auth";
// import type { LayoutProps } from "@/components/Layout";
import ThumbsUpDown from "@/components/web/thumbs-up-down";

type Conversations = {
  conversations: Conversation[];
};

("{ session: Session | null; selectedBot: Bot | undefined; id: any; }");
async function fetchConversations(
  session: Session | null,
  botId: number | undefined,
  selectedFilter: string
): Promise<false | Conversations> {
  if (!session || !botId) {
    return Promise.resolve(false);
  }

  const orgId = orgChooser(session);
  let url = `${URL}/api/conversations?organization_id=${orgId}&bot_id=${botId}&include=users`;

  if (selectedFilter === FILTER_UP) {
    url += "&is_helpful=true";
  } else if (selectedFilter === FILTER_DOWN) {
    url += "&is_helpful=false";
  }

  const res = await fetch(url);
  return res.json() as Promise<Conversations>;
}

const FILTER_ALL = "All";
const FILTER_UP = "Up";
const FILTER_DOWN = "Down";

// comment
function filterButtonStyle({
  filter,
  selectedFilter
}: {
  filter: string;
  selectedFilter: string | null;
}) {
  const color = filter === selectedFilter ? "blue" : "unset";
  return { color };
}

export default function ConversationsTable({ selectedBot, session }: any) {
  const [hoverRowIndex, setHoverRowIndex] = useState<null | number>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>(FILTER_ALL);

  // NOTE: there's a non-user-impacting bug where `useQuery` makes 2 fetches whenever `selectedFilter` changes.
  // One for the old value and one for the new value. It should only make one request for the new value.
  // This issue also causes `isLoading` to return `false` after first request is done so we use `isFetching` instead.
  const { data, error, isFetching } = useQuery(
    [`conversations${selectedBot?.id}`, selectedFilter],
    () => fetchConversations(session, selectedBot?.id, selectedFilter),
    { enabled: session !== null && selectedBot !== undefined }
  );

  const router = useRouter();
  function openConversation(public_id: number) {
    router.push(`/conversation/${public_id}?bot_id=${selectedBot?.id}`);
  }

  function filterTable({ filter }: { filter: string }) {
    if (filter !== selectedFilter) setSelectedFilter(filter);
  }

  if (error) {
    return <h1>Error - please contact WiselyDesk directly and pass the URL</h1>;
  }

  if (isFetching) {
    return (
      <svg
        className="mr-3 h-5 w-5 animate-spin text-blue-500"
        viewBox="0 0 24 24">
        <circle
          className="opacity-0"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="grey"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  }

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      <div className="space-x-4">
        <button
          style={filterButtonStyle({ filter: FILTER_ALL, selectedFilter })}
          onClick={() => filterTable({ filter: FILTER_ALL })}>
          All
        </button>
        <button
          style={filterButtonStyle({ filter: FILTER_UP, selectedFilter })}
          onClick={() => filterTable({ filter: FILTER_UP })}>
          <ThumbsUpDown direction="up" />
        </button>
        <button
          style={filterButtonStyle({ filter: FILTER_DOWN, selectedFilter })}
          onClick={() => filterTable({ filter: FILTER_DOWN })}>
          <ThumbsUpDown direction="down" />
        </button>
      </div>
      <table className="min-w-full table-fixed divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              ID
            </th>
            <th
              scope="col"
              className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900">
              Summary
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              User
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
              First Message At
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Last Message At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-gray-100">
          {data &&
            data.conversations.map((conversation, index: number) => (
              <tr
                key={conversation.id}
                onMouseEnter={() => setHoverRowIndex(index)}
                onMouseLeave={() => setHoverRowIndex(null)}
                onClick={() => openConversation(conversation.public_id)}
                className="hover:cursor-pointer hover:bg-gray-200">
                <td
                  className={`px-3 py-4 text-sm text-gray-900 ${
                    index === hoverRowIndex && "bg-blue-50"
                  }`}>
                  {conversation.public_id}
                </td>
                <td
                  className={`w-[50%] py-4 pl-2 pr-3 text-sm font-medium text-gray-900 ${
                    index === hoverRowIndex && "bg-blue-50"
                  }`}>
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
                <td
                  className={`hidden px-3 py-4 text-sm text-gray-500 sm:table-cell ${
                    index === hoverRowIndex && "bg-blue-50"
                  }`}>
                  Anonymous
                </td>
                <td
                  className={`hidden px-3 py-4 text-sm text-gray-500 lg:table-cell ${
                    index === hoverRowIndex && "bg-blue-50"
                  }`}>
                  {formatUnixTimestamp(conversation.created_at)}
                </td>
                <td
                  className={`hidden overflow-ellipsis whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell ${
                    index === hoverRowIndex && "bg-blue-50"
                  }`}>
                  {formatUnixTimestamp(conversation.created_at)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
