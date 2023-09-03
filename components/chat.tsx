"use client";
import { type ChatThemeSettings } from "@/lib/chat-theme";
import { welcomeReply } from "@/lib/services/welcome-reply";
import Agent from "@/components/agent";
import User from "@/components/user";
import { useState } from "react";
import ChatMessage from "@/lib/chat-message";

export type SearchParams = {
  german_source?: string;
  create_support_ticket?: string;
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
    german_source: germanSource,
    create_support_ticket: createSupportTicket,
    client_api_key: clientApiKey,
    model
  } = searchParams;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const locale = searchParams.locale ?? "en";

  return (
    <>
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
      />
      {messages.map((message, index) => {
        return message.sender === "user" ? (
          // <User chatTheme={chatTheme} />
          <p>hi</p>
        ) : (
          <Agent chatTheme={chatTheme} text={"hello"} locale={locale} />
        );
      })}
    </>
  );
}
