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
  filter,
  tags,
  childrenTags
}: {
  orgId: number;
  botId: string;
  filter: string;
  tags?: string[];
  childrenTags?: string[];
}) {
  let url = new URL(`${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversations`);

  switch (filter.toLowerCase()) {
    case "up":
      url.searchParams.append("is_helpful", "true");
      break;
    case "down":
      url.searchParams.append("is_helpful", "false");
      break;
    case "escalated":
      url.searchParams.append("filter", "escalated");
      break;
    // No default case needed unless you want to handle unexpected filters
  }

  if (tags && tags.length > 0) {
    tags.forEach(tag => url.searchParams.append("tags", tag));
  }

  if (childrenTags && childrenTags.length > 0) {
    childrenTags.forEach(tag => url.searchParams.append("childrenTags", tag));
  }

  let res;
  try {
    res = await fetch(url.toString(), { cache: "no-cache" });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res!.json() as Promise<Conversations>;
}

export default async function ConversationsPage({
  params,
  searchParams
}: {
  params: ParamsProps;
  searchParams: { tags?: string | string[]; childrenTags?: string | string[] };
}) {
  const { filter = "all", id: botId } = params;
  const session = await fetchServerSession();

  const orgId = orgChooser(session);
  const tags = Array.isArray(searchParams.tags)
    ? searchParams.tags
    : searchParams.tags
      ? [searchParams.tags]
      : undefined;
  const childrenTags = Array.isArray(searchParams.childrenTags)
    ? searchParams.childrenTags
    : searchParams.childrenTags
      ? [searchParams.childrenTags]
      : undefined;
  const data = await getConversations({
    orgId,
    botId,
    filter,
    tags,
    childrenTags
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
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
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
