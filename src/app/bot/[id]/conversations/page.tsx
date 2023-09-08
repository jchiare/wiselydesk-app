import ConversationsTableParent from "@/components/web/conversations/conversations-table-parent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Conversations | WiselyDesk",
  description: "View your bots conversations"
};

type SearchParamsProps = {
  filter?: "all" | "down" | "up";
};

type ParamsProps = {
  id: string;
};

export default async function ConversationsPage({
  searchParams,
  params
}: {
  searchParams: SearchParamsProps;
  params: ParamsProps;
}) {
  const botId = params.id;
  const { filter = "all" } = searchParams;
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  return (
    <ConversationsTableParent botId={botId} session={session} filter={filter} />
  );
}
