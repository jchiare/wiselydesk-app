import { URL } from "@/lib/shared/constants";
import { orgChooser } from "@/lib/shared/orgChooser";
import type { Conversation } from "@prisma/client";
import type { Session } from "next-auth";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import ConversationTable from "./conversation-table";

type Conversations = {
  conversations: Conversation[];
};

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
async function getConversations({
  orgId,
  botId,
  selectedFilter
}: {
  orgId: number;
  botId: string;
  selectedFilter: string;
}) {
  let url = `${URL}/api/conversations?organization_id=${orgId}&bot_id=${botId}&include=users`;

  if (selectedFilter.toLowerCase() === FILTER_UP.toLowerCase()) {
    url += "&is_helpful=true";
  } else if (selectedFilter.toLowerCase() === FILTER_DOWN.toLowerCase()) {
    url += "&is_helpful=false";
  }

  console.log(url);
  let res;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e) {
    console.error(e);
  }
  return res!.json() as Promise<Conversations>;
}

export default async function ConversationsTableParent({
  selectedBot,
  session,
  filter: selectedFilter
}: any) {
  const orgId = orgChooser(session);
  const data = await getConversations({
    orgId,
    botId: selectedBot.id,
    selectedFilter
  });
  const hoverRowIndex = 1;
  console.log(data);

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      <div className="space-x-4">
        <button
          style={filterButtonStyle({ filter: FILTER_ALL, selectedFilter })}
          //   onClick={() => filterTable({ filter: FILTER_ALL })}
        >
          All
        </button>
        <button
          style={filterButtonStyle({ filter: FILTER_UP, selectedFilter })}
          //   onClick={() => filterTable({ filter: FILTER_UP })}
        >
          <ThumbsUpDown direction="up" />
        </button>
        <button
          style={filterButtonStyle({ filter: FILTER_DOWN, selectedFilter })}
          //   onClick={() => filterTable({ filter: FILTER_DOWN })}
        >
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
          <ConversationTable data={data} />
        </tbody>
      </table>
    </div>
  );
}
