import Agent from "@/components/chat/agent/index-widget";
import User from "@/components/chat/user/index-widget";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import type { Bot, Message } from "@prisma/client";

type Props = {
  chatTheme: ChatThemeSettings;
  account: string;
  bot: Bot;
  createSupportTicket: boolean;
  testSupportModal: boolean;
  aiResponseDone: boolean;
  latestMessageId: number | null | undefined;
  conversationId: number | null | undefined;
  locale: string;
  sources: string[];
  lastConversationMessages: Message[];
};

export function PreviousMessages({
  chatTheme,
  account,
  bot,
  createSupportTicket,
  aiResponseDone,
  locale,
  testSupportModal,
  sources,
  latestMessageId,
  conversationId,
  lastConversationMessages
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
    </>
  );
}
