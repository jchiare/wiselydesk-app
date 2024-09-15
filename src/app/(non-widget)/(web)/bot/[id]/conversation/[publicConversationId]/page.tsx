import { RightBar } from "@/components/web/conversation/right-bar";
import type { Metadata } from "next/types";
import { fetchServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Message } from "@prisma/client";
import { AgentMessage } from "@/components/web/conversation/agent/message";
import { UserMessage } from "@/components/web/conversation/user-message";
import type { JsonObject, JsonValue } from "@prisma/client/runtime/library";

export const dynamic = "force-dynamic";

function isMessageFromUser(message: Message) {
  return message.index % 2 > 0;
}

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

type AiDebugLog = {
  modelVersion: string | null;
  formattedMessages: { role: string; content: string }[] | null;
  responseTime: string | null;
};

function parseAiDebugLog(aiDebugLog: AiDebugLog) {
  if (aiDebugLog) {
    return {
      modelVersion: aiDebugLog.modelVersion,
      formattedMessages: aiDebugLog.formattedMessages,
      responseTime: aiDebugLog.responseTime
    };
  }
  return null;
}

export default async function WebConversationPage({
  params
}: {
  params: ParamsType;
}) {
  const session = await fetchServerSession();
  const userId = session.user.internal_user_id;

  const conversation = await prisma.conversation.findFirst({
    where: {
      public_id: parseInt(params.publicConversationId, 10),
      bot_id: parseInt(params.id, 10)
    }
  });

  if (!conversation) {
    console.error(
      `Conversation '${params.publicConversationId}' for bot id '${params.id}' doesn't exist`
    );
    return <div>Conversation not found</div>;
  }

  const messages = await prisma.message.findMany({
    where: {
      conversation_id: conversation.id
    }
  });

  const messageIds = messages.map(message => message.id);

  const AiDebugLog = new Map(
    (
      await prisma.aiInput.findMany({
        where: {
          conversationId: conversation.id,
          messageId: {
            in: messageIds
          }
        },
        select: {
          messageId: true,
          log: true
        }
      })
    ).map(aiInput => [aiInput.messageId, aiInput.log])
  );

  const conversationObject = {
    conversation: {
      messages,
      ...conversation
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-col">
      <div className="p-4 sm:mr-[300px] sm:px-6 sm:py-14 lg:px-16">
        {conversationObject.conversation.messages.map(message => {
          const { modelVersion, formattedMessages, responseTime } =
            parseAiDebugLog(AiDebugLog.get(message.id) as AiDebugLog) || {
              modelVersion: null,
              formattedMessages: null,
              responseTime: null
            };
          return (
            <div key={message.id}>
              {isMessageFromUser(message) ? (
                <UserMessage
                  text={message.text}
                  sentTime={message.created_at}
                />
              ) : (
                <AgentMessage
                  text={message.text}
                  sentTime={message.created_at}
                  sources={message.sources}
                  isHelpful={message.is_helpful}
                  isFirstMessage={message.index === 0}
                  isFinished={message.finished}
                  modelVersion={modelVersion}
                  formattedMessages={formattedMessages}
                  responseTime={responseTime}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="border-2 border-y-0 border-gray-300 bg-gray-200 sm:fixed sm:right-0 sm:h-screen sm:min-w-[350px] sm:max-w-[350px]">
        <RightBar
          toReview={conversationObject.conversation.to_review}
          conversationId={conversationObject.conversation.id}
          zendeskTicketUrl={conversationObject.conversation.zendesk_ticket_url}
          publicConversationId={parseInt(params.publicConversationId, 10)}
          botId={params.id}
          userId={userId}
        />
      </div>
    </div>
  );
}
