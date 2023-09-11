import ConversationsTable from "@/components/web/conversations/table";
import type { Metadata } from "next";
import type { Conversation } from "@prisma/client";
import { orgChooser } from "@/lib/shared/orgChooser";
import { URL } from "@/lib/shared/constants";
import { fetchServerSession } from "@/lib/shared/auth";

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
  filter: "all" | "down" | "up";
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
  let url = `${URL}/api/conversations?organization_id=${orgId}&bot_id=${botId}&include=users`;

  if (filter.toLowerCase() === "up") {
    url += "&is_helpful=true";
  } else if (filter.toLowerCase() === "down") {
    url += "&is_helpful=false";
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
        <ConversationsTable data={data} />
      </tbody>
    </table>
  );
}
