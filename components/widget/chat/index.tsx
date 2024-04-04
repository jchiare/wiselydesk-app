"use client";
import {
  combineClassNames,
  type ChatThemeSettings
} from "@/lib/chat/chat-theme";
import { welcomeReply } from "@/lib/shared/services/welcome-reply";
import Agent from "@/components/chat/agent/index-widget";
import User from "@/components/chat/user/index-widget";
import { useChatSubmit } from "@/lib/chat/hooks/use-widget-chat-submit";
import { useScrollToBottom } from "@/lib/chat/hooks/use-scroll-to-bottom";
import Input from "@/components/chat/user/input-widget";
import CancelResponse from "@/components/chat/cancel-response";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { getMessagesFromConversationId } from "@/lib/visitor/identify";
import { PreviousMessages } from "@/components/widget/chat/previous-messages";

import type { Bot, Conversation, Message } from "@prisma/client";

export type SearchParams = {
  create_support_ticket?: boolean;
  model?: string;
  locale: string;
  inline_sources?: boolean;
  testSupportModal?: boolean;
};

type ChatProps = {
  chatTheme: ChatThemeSettings;
  searchParams: SearchParams;
  account: string;
  bot: Bot;
  clientApiKey: string;
  lastConversation: Conversation | undefined;
};

export default function Chat({
  chatTheme,
  searchParams,
  account,
  bot,
  clientApiKey,
  lastConversation
}: ChatProps): JSX.Element {
  const [lastConversationMessages, setLastConversationMessages] = useState<
    Message[]
  >([]);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (lastConversation) {
      getMessagesFromConversationId(lastConversation.id).then(messages => {
        setLastConversationMessages(messages);
      });
    }
  }, [lastConversation]);

  useEffect(() => {
    checkOverflow();
  }, [lastConversationMessages]);

  const {
    locale = "en",
    create_support_ticket: createSupportTicket = true,
    model = "gpt-4",
    inline_sources: inlineSources = false,
    testSupportModal = false
  } = searchParams;

  const {
    messages,
    input,
    setInput,
    aiResponseDone,
    onSubmit,
    sources,
    latestMessageId,
    conversationId,
    setAiResponseDone
  } = useChatSubmit({
    initialMessages: [],
    clientApiKey,
    createSupportTicket,
    model,
    account,
    inlineSources,
    lastConversationId: lastConversation?.id
  });

  useEffect(() => {
    const scope = Sentry.getCurrentScope();
    if (scope) {
      scope.setTag("conversationId", conversationId);
      scope.setTag("botId", bot.id);
    }
  }, [conversationId, bot]);

  const messagesEndRef = useScrollToBottom({
    messages,
    sources,
    lastConversationMessages
  });

  const divRef = useRef<HTMLDivElement>(null);

  function checkOverflow() {
    if (divRef.current) {
      const currentOverflowing =
        divRef.current.scrollHeight > divRef.current.clientHeight;
      if (currentOverflowing !== isOverflowing) {
        setIsOverflowing(currentOverflowing);
      }
    }
  }
  useLayoutEffect(() => {
    window.addEventListener("resize", checkOverflow);
    checkOverflow(); // Check overflow on mount and when window resizes.

    return () => window.removeEventListener("resize", checkOverflow);
  }, []); // Dependencies are not needed if they're not used in checkOverflow.

  const hasLastConversationMessages =
    lastConversationMessages && lastConversationMessages.length > 0;

  return (
    <div
      ref={divRef}
      className={`flex h-[calc(100vh-20px)] w-full flex-col items-center overflow-scroll text-[90%] antialiased md:h-[calc(100vh-100px)] ${combineClassNames(
        chatTheme.baseSettings
      )} flex-shrink-0 font-medium`}>
      {hasLastConversationMessages && (
        <PreviousMessages
          bot={bot}
          chatTheme={chatTheme}
          account={account}
          createSupportTicket={createSupportTicket}
          aiResponseDone={aiResponseDone}
          locale={locale}
          sources={sources}
          latestMessageId={latestMessageId}
          lastConversation={lastConversation}
          conversationId={conversationId!}
          lastConversationMessages={lastConversationMessages}
        />
      )}
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
        key={0}
        aiResponseDone={true}
        isWelcomeMessage={true}
        hasLastConversationMessages={hasLastConversationMessages}
        isLastMessage={messages.length === 0}
        bot={bot}
        testSupportModal={testSupportModal}
        isOverflowing={isOverflowing}
      />
      {messages.map((message, index) => {
        const isLastMessage = messages.length === index + 1;
        return message.sender === "user" ? (
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
            isOverflowing={isOverflowing}
          />
        );
      })}

      <div
        className={`absolute bottom-0 left-0 mt-10 flex w-full justify-center ${chatTheme.assistantMessageSetting.bgColour}`}>
        <CancelResponse
          aiResponseDone={aiResponseDone}
          setAiResponseDone={setAiResponseDone}
          // @ts-expect-error done with ts for the day
          locale={locale}
          account={account}
        />
        <Input
          chatTheme={chatTheme}
          account={account}
          // @ts-expect-error done with ts for the day
          locale={locale}
          onSubmit={onSubmit}
          setInput={setInput}
          input={input}
          aiResponseDone={aiResponseDone}
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
