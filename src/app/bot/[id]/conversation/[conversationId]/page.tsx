import SingleConversation from "@/components/web/conversation";
import RightBar from "@/components/web/conversation/right-bar";
import { URL } from "@/lib/shared/constants";
import type { SingleConversationReturnType } from "@/dto/single-conversation";
import type { Metadata } from "next/types";
import { fetchServerSession } from "@/lib/shared/auth";

type ParamsType = {
  conversationId: string;
  id: string;
};

export async function generateMetadata({
  params
}: {
  params: ParamsType;
}): Promise<Metadata> {
  return {
    title: `Conversation #${params.conversationId} | WiselyDesk`,
    description: `View conversation #${params.conversationId} for bot #${params.id} in WiselyDesk`
  };
}

async function fetchConversation(id: string, botId: string) {
  const res = await fetch(`${URL}/api/conversation/${id}?bot_id=${botId}`, {
    cache: "no-cache"
  });
  const json = await res.json();
  return json as SingleConversationReturnType;
}

export default async function SingleConversationPage({
  params
}: {
  params: ParamsType;
}) {
  await fetchServerSession();

  const conversation = await fetchConversation(
    params.conversationId,
    params.id
  );

  return (
    <div className="flex">
      <div className="mr-[300px] px-4 py-10 sm:px-6 lg:px-16 lg:py-10">
        <SingleConversation conversation={conversation} />
      </div>
      <div className="fixed right-0 h-screen min-w-[300px] max-w-[300px] border-2 border-y-0 border-gray-300 bg-gray-200 px-4 pt-6 sm:px-6">
        <RightBar conversation={conversation} />
      </div>
    </div>
  );
}
