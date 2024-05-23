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
import { useEffect, useRef, useState } from "react";
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
  widgetOpen?: string;
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
  const scrollHeightRef = useRef<number>(0);
  const divRef = useRef<HTMLDivElement>(null);

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
    model = "gpt-4o",
    inline_sources: inlineSources = true,
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

  useEffect(() => {
    checkOverflow();
  }, []);

  const checkOverflow = () => {
    if (divRef.current) {
      const currentScrollHeight = divRef.current.scrollHeight;
      const isCurrentlyOverflowing =
        currentScrollHeight > divRef.current.clientHeight;

      // Only update the overflow state if it has changed
      if (
        currentScrollHeight !== scrollHeightRef.current ||
        isCurrentlyOverflowing !== isOverflowing
      ) {
        scrollHeightRef.current = currentScrollHeight;
        setIsOverflowing(isCurrentlyOverflowing);
      }
    }
  };

  useEffect(() => {
    // Set up MutationObserver to monitor DOM changes
    const observer = new MutationObserver(checkOverflow);
    if (divRef.current) {
      observer.observe(divRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Set up event listener for window resize
    window.addEventListener("resize", checkOverflow);

    // Initial check
    checkOverflow();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const hasLastConversationMessages =
    lastConversationMessages && lastConversationMessages.length > 0;

  return (
    <div
      ref={divRef}
      className={`flex h-full w-full flex-col items-center overflow-scroll text-[90%] antialiased ${combineClassNames(
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
        bgColorOverride="bg-[#0AA6B8]"
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
