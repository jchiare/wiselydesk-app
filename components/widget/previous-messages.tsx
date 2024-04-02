"use client";
import Agent from "@/components/chat/agent/index-widget";
import User from "@/components/chat/user/index-widget";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
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
          />
        );
      })}
      {lastConversation?.ended_at && (
        <div>Conversation ended: {lastConversation.ended_at.toISOString()}</div>
      )}
    </>
  );
}
