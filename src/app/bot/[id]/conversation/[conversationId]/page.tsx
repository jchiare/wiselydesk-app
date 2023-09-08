import SingleConversation from "@/components/web/conversation";
import RightBar from "@/components/web/conversation/right-bar";
import { URL } from "@/lib/shared/constants";
import type { SingleConversationReturnType } from "@/dto/single-conversation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { Metadata } from "next/types";
import BackButton from "@/components/web/back-button";

type ParamsType = {
  conversationId: string;
  id: string;
};

export const metadata: Metadata = {
  title: "Single Conversation | WiselyDesk",
  description: "View a single conversation in WiselyDesk"
};

async function fetchConversation(id: string, botId: string) {
  const res = await fetch(`${URL}/api/conversation/${id}?bot_id=${botId}`);
  const json = await res.json();
  return json as SingleConversationReturnType;
}

export default async function SingleConversationPage({
  params
}: {
  params: ParamsType;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");

  const conversation = await fetchConversation(
    params.conversationId,
    params.id
  );

  return (
    <div className="flex h-screen overflow-y-scroll">
      <div className="mr-96 h-full flex-1">
        <BackButton />
        {
          <div>
            <div className="px-4 py-10 sm:px-6 lg:px-16 lg:py-10">
              <SingleConversation conversation={conversation} />
            </div>
          </div>
        }
      </div>

      <div className="fixed right-0 h-screen w-96 border-2 border-y-0 border-gray-300 bg-gray-200 px-4 pt-6 sm:px-6 lg:px-8 ">
        <RightBar conversation={conversation} />
      </div>
    </div>
  );
}
