import { URL } from "@/lib/shared/constants";
import { orgChooser } from "@/lib/shared/orgChooser";
import type { Conversation } from "@prisma/client";
import ConversationTable from "./conversation-table";
import ConversationsTableFilter from "@/components/bot/filter-conversations-table";

type Conversations = {
  conversations: Conversation[];
};

const FILTER_UP = "Up";
const FILTER_DOWN = "Down";

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

  let res;
  try {
    res = await fetch(url, { next: { revalidate: 30 } });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res!.json() as Promise<Conversations>;
}

export default async function ConversationsTableParent({
  botId,
  session,
  filter: selectedFilter
}: any) {
  const orgId = orgChooser(session);
  const data = await getConversations({
    orgId,
    botId,
    selectedFilter
  });

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      <ConversationsTableFilter filter={selectedFilter} />
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
