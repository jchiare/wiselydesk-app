import SingleConversation from "@/components/web/conversation";
import RightBar from "@/components/web/conversation/right-bar";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import type { SingleConversationReturnType } from "@/types/single-conversation";
import type { Metadata } from "next/types";
import { fetchServerSession } from "@/lib/shared/auth";

export const dynamic = "force-dynamic";

type ParamsType = {
  publicConversationId: string;
  id: string;
};

export async function generateMetadata({
  params
}: {
  params: ParamsType;
}): Promise<Metadata> {
  return {
    title: `Conversation #${params.publicConversationId} | WiselyDesk`,
    description: `View conversation #${params.publicConversationId} for bot #${params.id} in WiselyDesk`
  };
}

async function fetchConversation(publicConversationId: string, botId: string) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/public-conversation/${publicConversationId}`,
    {
      cache: "no-cache"
    }
  );
  const json = await res.json();
  return json as SingleConversationReturnType;
}

export default async function SingleConversationPage({
  params
}: {
  params: ParamsType;
}) {
  const session = await fetchServerSession();
  const userId = session.user.internal_user_id;

  const conversation = await fetchConversation(
    params.publicConversationId,
    params.id
  );

  return (
    <div className="flex">
      <div className="mr-[300px] px-4 py-10 sm:px-6 lg:px-16 lg:py-10">
        <SingleConversation conversation={conversation} />
      </div>
      <div className="fixed right-0 h-screen min-w-[350px] max-w-[350px] border-2 border-y-0 border-gray-300 bg-gray-200">
        <RightBar
          toReview={conversation.conversation.to_review}
          ticketDeflected={conversation.conversation.ticket_deflected}
          conversationId={conversation.conversation.id}
          zendeskTicketUrl={conversation.conversation.zendesk_ticket_url}
          publicConversationId={params.publicConversationId}
          botId={params.id}
          userId={userId}
        />
      </div>
    </div>
  );
}
