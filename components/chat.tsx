"use client";
import { combineClassNames, type ChatThemeSettings } from "@/lib/chat-theme";
import { welcomeReply } from "@/lib/services/welcome-reply";
import Agent from "@/components/agent";
import User from "@/components/user";
import { useState } from "react";
import ChatMessage from "@/lib/chat-message";
import { useChatSubmit } from "@/lib/hooks/use-chat-submit";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";
import Input from "@/components/user/input";

export type SearchParams = {
  german_source?: string;
  create_support_ticket?: boolean;
  client_api_key: string;
  model?: string;
  locale: string;
};

type ChatProps = {
  chatTheme: ChatThemeSettings;
  searchParams: SearchParams;
  account: string;
};

export default function Chat({
  chatTheme,
  searchParams,
  account
}: ChatProps): JSX.Element {
  const {
    locale = "en",
    create_support_ticket: createSupportTicket = false,
    client_api_key: clientApiKey,
    model = "gpt-4"
  } = searchParams;

  const {
    messages,
    input,
    setInput,
    aiResponseDone,
    assistantStreamingResponse,
    onSubmit,
    sources,
    latestMessageId,
    conversationId
  } = useChatSubmit({
    initialMessages: [],
    clientApiKey,
    createSupportTicket,
    model,
    account
  });

  const messagesEndRef = useScrollToBottom({
    messages,
    sources
  });

  return (
    <main
      className={`flex h-[calc(100vh-100px)] w-full flex-col items-center overflow-scroll antialiased ${combineClassNames(
        chatTheme.baseSettings
      )} flex-shrink-0 font-medium`}>
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
        key={0}
        aiResponseDone={false}
        isLastMessage={false}
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
          />
        );
      })}
      <div ref={messagesEndRef} />

      <Input
        chatTheme={chatTheme}
        account={account}
        locale={locale}
        onSubmit={onSubmit}
        setInput={setInput}
        input={input}
        aiResponseDone={aiResponseDone}
      />
    </main>
  );
}
