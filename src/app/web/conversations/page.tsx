import ConversationsTableParent from "@/components/web/conversations-table-parent";
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

export default async function ConversationsPage({
  searchParams
}: {
  searchParams: SearchParamsProps;
}) {
  const { filter = "all" } = searchParams;
  const selectedBot = { id: 1 };
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  return (
    <div className="p-4 sm:p-6 lg:px-16 lg:py-10 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Conversations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your conversations.
          </p>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <ConversationsTableParent
          selectedBot={selectedBot}
          session={session}
          filter={filter}
        />
      </div>
    </div>
  );
}
