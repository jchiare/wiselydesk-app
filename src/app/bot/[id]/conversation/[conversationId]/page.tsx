import SingleConversation from "@/components/web/conversation";
import RightBar from "@/components/web/conversation/right-bar";
import { URL, NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import type { SingleConversationReturnType } from "@/dto/single-conversation";
import type { Metadata } from "next/types";
import type { Note as NoteType } from "@prisma/client";
import { fetchServerSession } from "@/lib/shared/auth";

export const dynamic = "force-dynamic";

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

async function fetchNotes(id: string) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/conversation/${id}/notes`,
    {
      cache: "no-cache"
    }
  );

  const json = await res.json();
  return json.notes as NoteType[];
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

  const notes = await fetchNotes(params.conversationId);

  return (
    <div className="flex">
      <div className="mr-[300px] px-4 py-10 sm:px-6 lg:px-16 lg:py-10">
        <SingleConversation conversation={conversation} />
      </div>
      <div className="fixed right-0 h-screen min-w-[350px] max-w-[350px] border-2 border-y-0 border-gray-300 bg-gray-200">
        <RightBar
          notes={notes}
          toReview={conversation.conversation.to_review}
          ticketDeflected={conversation.conversation.ticket_deflected}
          conversationId={params.conversationId}
        />
      </div>
    </div>
  );
}
