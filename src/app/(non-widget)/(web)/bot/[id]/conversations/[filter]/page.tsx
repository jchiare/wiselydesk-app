import ConversationsTable from "@/components/web/conversations/table";
import type { Metadata } from "next";
import type { Conversation } from "@prisma/client";
import { orgChooser } from "@/lib/org-chooser";
import { NEXTJS_BACKEND_URL } from "@/lib/constants";
import { fetchServerSession } from "@/lib/auth";
import type { FilterType } from "@/components/web/conversations/filter-conversations-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conversations | WiselyDesk",
  description: "View your bots conversations"
};

type Conversations = {
  conversations: Conversation[];
};
type ParamsProps = {
  id: string;
  filter: FilterType;
};

async function getConversations({
  orgId,
  botId,
  filter
}: {
  orgId: number;
  botId: string;
  filter: string;
}) {
  let url = `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversations`;

  switch (filter.toLowerCase()) {
    case "up":
      url += "?is_helpful=true";
      break;
    case "down":
      url += "?is_helpful=false";
      break;
    case "escalated":
      url += "?filter=escalated";
      break;
    // No default case needed unless you want to handle unexpected filters
  }

  let res;
  try {
    res = await fetch(url, { cache: "no-cache" });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res!.json() as Promise<Conversations>;
}

export default async function ConversationsPage({
  params
}: {
  params: ParamsProps;
}) {
  const { filter = "all", id: botId } = params;
  const session = await fetchServerSession();

  const orgId = orgChooser(session);
  const data = await getConversations({
    orgId,
    botId,
    filter
  });

  return (
    <table className="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
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
            {filter === "escalated" ? "Escalated Reason" : "Escalated"}
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            Rating
          </th>
          <th
            scope="col"
            className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            First Message
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-gray-100">
        <ConversationsTable data={data} filter={filter} />
      </tbody>
    </table>
  );
}
