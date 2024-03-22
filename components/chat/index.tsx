"use client";
import {
  combineClassNames,
  type ChatThemeSettings
} from "@/lib/chat/chat-theme";
import { welcomeReply } from "@/lib/shared/services/welcome-reply";
import Agent from "@/components/chat/agent";
import User from "@/components/chat/user";
import { useChatSubmit } from "@/lib/chat/hooks/use-chat-submit";
import { useScrollToBottom } from "@/lib/chat/hooks/use-scroll-to-bottom";
import Input from "@/components/chat/user/input";
import CancelResponse from "@/components/chat/cancel-response";
import type { Bot } from "@prisma/client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export type SearchParams = {
  create_support_ticket?: boolean;
  client_api_key: string;
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
};

export default function Chat({
  chatTheme,
  searchParams,
  account,
  bot
}: ChatProps): JSX.Element {
  const {
    locale = "en",
    create_support_ticket: createSupportTicket = true,
    client_api_key: clientApiKey,
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
    inlineSources
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
    sources
  });

  return (
    <main
      className={`flex h-[calc(100vh-20px)] w-full flex-col items-center overflow-scroll antialiased md:h-[calc(100vh-100px)] ${combineClassNames(
        chatTheme.baseSettings
      )} flex-shrink-0 font-medium`}>
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
        key={0}
        aiResponseDone={false}
        isLastMessage={false}
        bot={bot}
        testSupportModal={testSupportModal}
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
            conversationId={conversationId}
            createSupportTicket={createSupportTicket}
            bot={bot}
          />
        );
      })}
      <div ref={messagesEndRef} />
      <div className="absolute bottom-0 left-0 flex w-full justify-center">
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
    </main>
  );
}
