import ConversationsTable from "@/components/web/conversations/table";
import { orgChooser } from "@/lib/shared/org-chooser";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import { fetchServerSession } from "@/lib/shared/auth";
import type { FilterType } from "@/components/web/conversations/filter-conversations-table";
import type { Metadata } from "next";
import type { ConversationDTO } from "@/src/app/api/bot/[id]/conversations/route";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conversations | WiselyDesk",
  description: "View your bots conversations"
};

type ParamsProps = {
  id: string;
  filter: FilterType;
};

async function getConversations({
  botId,
  filter,
  page
}: {
  botId: string;
  filter: string;
  page: string;
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

  const params = new URLSearchParams(url);
  params.set("page", page);

  let res;
  try {
    res = await fetch(url, { cache: "no-cache" });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res!.json() as Promise<ConversationDTO>;
}

export default async function ConversationsPage({
  params,
  searchParams
}: {
  params: ParamsProps;
  searchParams: { page: string };
}) {
  const { filter = "all", id: botId } = params;
  // const session = await fetchServerSession();

  // const orgId = orgChooser(session);
  const currentPage = searchParams?.page || "1";
  const data = await getConversations({
    botId,
    filter,
    page: currentPage
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
            Escalated Reason
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            Rating
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            First Message At
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-gray-100">
        <ConversationsTable data={data} />
      </tbody>
    </table>
  );
}
