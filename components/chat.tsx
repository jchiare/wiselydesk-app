"use client";
import { type ChatThemeSettings } from "@/lib/chat-theme";
import { welcomeReply } from "@/lib/services/welcome-reply";
import Agent from "@/components/agent";
import User from "@/components/user";
import { useState } from "react";
import ChatMessage from "@/lib/chat-message";
import { useChatSubmit } from "@/lib/hooks/use-chat-submit";
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
    assistantResponseFinished,
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

  return (
    <>
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
      />
      {messages.map((message, index) => {
        return message.sender === "user" ? (
          <User chatTheme={chatTheme} text={message.text} />
        ) : (
          <Agent chatTheme={chatTheme} text={message.text} locale={locale} />
        );
      })}
      <Input
        chatTheme={chatTheme}
        account={account}
        locale={locale}
        onSubmit={onSubmit}
        setInput={setInput}
        input={input}
        assistantResponseFinished={assistantResponseFinished}
      />
    </>
  );
}
