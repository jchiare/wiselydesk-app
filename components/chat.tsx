"use client";
import { combineClassNames, type ChatThemeSettings } from "@/lib/chat-theme";
import Agent from "@/components/agent";
import User from "@/components/user";
import { useState } from "react";
import ChatMessage from "@/lib/chat-message";

export type SearchParams = {
  german_source?: string;
  create_support_ticket?: string;
  client_api_key: string;
  model?: string;
};

type ChatProps = {
  chatTheme: ChatThemeSettings;
  searchParams: SearchParams;
};

export default function Chat({
  chatTheme,
  searchParams,
}: ChatProps): JSX.Element {
  const {
    german_source: germanSource,
    create_support_ticket: createSupportTicket,
    client_api_key: clientApiKey,
    model,
  } = searchParams;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <>
      <Agent chatTheme={chatTheme} text={"hello"} />
      {messages.map((message, index) => {
        return message.sender === "user" ? (
          // <User chatTheme={chatTheme} />
          <p>hi</p>
        ) : (
          <Agent chatTheme={chatTheme} text={"hello"} />
        );
      })}
    </>
  );
}
