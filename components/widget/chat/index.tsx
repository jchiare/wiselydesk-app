"use client";
import {
  combineClassNames,
  type ChatThemeSettings
} from "@/lib/chat/chat-theme";
import { welcomeReply } from "@/lib/shared/services/welcome-reply";
import Agent from "@/components/widget/chat/agent-message";
import User from "@/components/widget/chat/user-message";
import { useChatSubmit } from "@/lib/chat/hooks/use-widget-chat-submit";
import { useScrollToBottom } from "@/lib/chat/hooks/use-scroll-to-bottom";
import Input from "@/components/widget/chat/input";
import CancelResponse from "@/components/widget/chat/cancel-response";
import { useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";

import type { Bot, Conversation, Message } from "@prisma/client";
import { AgentRequest } from "@/lib/agent-request";
import ChatMessage from "@/lib/chat/chat-message";

export type SearchParams = {
  create_support_ticket?: boolean;
  model?: string;
  locale: string;
  inline_sources?: boolean;
  testSupportModal?: boolean;
  widgetOpen?: string;
  chatty?: boolean;
};

type ChatProps = {
  chatTheme: ChatThemeSettings;
  searchParams: SearchParams;
  account: string;
  botId: number;
  clientApiKey: string;
  lastConversation?: Conversation | undefined;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  conversationId: number | null;
  setConversationId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function Chat({
  chatTheme,
  searchParams,
  account,
  botId,
  clientApiKey,
  lastConversation,
  messages,
  setMessages,
  conversationId,
  setConversationId
}: ChatProps): JSX.Element {
  const [sources, setSources] = useState<string[]>([]);
  const [latestMessageId, setLatestMessageId] = useState<number | null>();
  const [input, setInput] = useState<string>("");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [supportTicketCreated, setSupportTicketCreated] = useState(false);

  const scrollHeightRef = useRef<number>(0);
  const divRef = useRef<HTMLDivElement>(null);

  const {
    locale = "en",
    create_support_ticket: createSupportTicket = true,
    model = "gpt-4o-2024-08-06",
    inline_sources: inlineSources = true,
    testSupportModal = false,
    chatty = false
  } = searchParams;

  const { aiResponseDone, onSubmit, setAiResponseDone } = useChatSubmit({
    clientApiKey,
    createSupportTicket,
    model,
    account,
    inlineSources,
    setInput,
    messages,
    setMessages,
    input,
    setSources,
    setLatestMessageId,
    setConversationId,
    conversationId,
    chatty
  });

  async function handleSubmit() {
    const agentRequestClient = new AgentRequest({
      botId
    });
    if (agentRequestClient.requestingAgent(input)) {
      // call non-streaming backend
      setMessages(prevMessages => [
        ...prevMessages,
        new ChatMessage({ text: input, sender: "user" })
      ]);
      let savedInput = input;
      setInput("");
      await fetch("/api/non-streaming-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messagesLength: messages.length,
          userInput: savedInput,
          clientApiKey,
          conversationId
        })
      })
        .then(response => response.json())
        .then(res => {
          setMessages(prevMessages => [
            ...prevMessages,
            new ChatMessage({ text: res.data.text, sender: "assistant" })
          ]);
          setAiResponseDone(true);
          if (!conversationId) {
            const conversationId = res.data.conversationId;
            setConversationId(conversationId);
          }
          setSources([]);
        })
        .catch(err => {
          throw new Error(err);
        });
    } else {
      onSubmit();
    }
  }

  useEffect(() => {
    const scope = Sentry.getCurrentScope();
    if (scope) {
      scope.setTag("conversationId", conversationId);
      scope.setTag("botId", botId);
    }
  }, [conversationId, botId]);

  const messagesEndRef = useScrollToBottom({
    messages,
    sources
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

  return (
    <div
      ref={divRef}
      className={`flex h-full w-full flex-col items-center overflow-scroll text-[90%] antialiased ${combineClassNames(
        chatTheme.baseSettings
      )} flex-shrink-0 font-medium`}>
      <Agent
        chatTheme={chatTheme}
        text={welcomeReply(account, locale)}
        locale={locale}
        key={0}
        aiResponseDone={true}
        isWelcomeMessage={true}
        isLastMessage={messages.length === 0}
        botId={botId}
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
            botId={botId}
            isOverflowing={isOverflowing}
            supportTicketCreated={supportTicketCreated}
            setSupportTicketCreated={setSupportTicketCreated}
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
          onSubmit={handleSubmit}
          setInput={setInput}
          input={input}
          aiResponseDone={aiResponseDone}
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
