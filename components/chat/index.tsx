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
            latestMessageId={latestMessageId}
            conversationId={conversationId}
            createSupportTicket={createSupportTicket}
          />
        );
      })}
      <div ref={messagesEndRef} />
      <div className="absolute bottom-0 left-0 flex w-full justify-center">
        <CancelResponse
          aiResponseDone={aiResponseDone}
          setAiResponseDone={setAiResponseDone}
          locale={locale}
          account={account}
        />
        <Input
          chatTheme={chatTheme}
          account={account}
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
