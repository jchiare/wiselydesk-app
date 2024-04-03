"use client";
import Agent from "@/components/chat/agent/index-widget";
import User from "@/components/chat/user/index-widget";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import { formatDateTime } from "@/lib/shared/utils";
import type { Bot, Conversation, Message } from "@prisma/client";

type Props = {
  chatTheme: ChatThemeSettings;
  account: string;
  bot: Bot;
  createSupportTicket: boolean;
  aiResponseDone: boolean;
  latestMessageId: number | null | undefined;
  conversationId: number;
  locale: string;
  sources: string[];
  lastConversationMessages: Message[];
  lastConversation: Conversation | undefined;
};

export function PreviousMessages({
  chatTheme,
  account,
  bot,
  createSupportTicket,
  aiResponseDone,
  locale,
  sources,
  latestMessageId,
  conversationId,
  lastConversationMessages,
  lastConversation
}: Props) {
  return (
    <>
      {lastConversationMessages.map((message, index) => {
        const isLastMessage = lastConversationMessages.length === index + 1;
        return index % 2 == 1 ? (
          <User chatTheme={chatTheme} text={message.text} key={index} />
        ) : (
          <Agent
            chatTheme={chatTheme}
            text={message.text}
            locale={locale}
            sources={isLastMessage ? sources : undefined} // only show sources on last message
            key={index}
            account={account}
            aiResponseDone={aiResponseDone}
            isLastMessage={isLastMessage}
            latestMessageId={latestMessageId}
            conversationId={conversationId?.toString()}
            createSupportTicket={createSupportTicket}
            bot={bot}
            isOverflowing={false}
            isPreviousMessages={true}
          />
        );
      })}
      {lastConversation?.ended_at && (
        <div className="w-full bg-gray-200 py-2 text-center">
          <p className="text-sm italic text-gray-800">
            Conversation automatically ended{" "}
            {formatDateTime(lastConversation.ended_at)}
          </p>
          <button>Click to continue conversation.</button>
        </div>
      )}
    </>
  );
}
