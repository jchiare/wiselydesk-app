"use client";
import { useState } from "react";
import Chat, { type SearchParams } from "@/components/widget/chat";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import type ChatMessage from "@/lib/chat/chat-message";

export function Widget({
  clientApiKey,
  searchParams,
  botId,
  chatTheme
}: {
  clientApiKey: string;
  searchParams: SearchParams;
  botId: number;
  chatTheme: ChatThemeSettings;
}): JSX.Element {
  const { widgetOpen } = searchParams;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  return (
    <div>
      {botId && widgetOpen && widgetOpen === "true" && (
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto fixed bottom-[100px] right-0 z-10 h-[calc(100%-104px)] min-h-[80px] w-full origin-bottom-right overflow-scroll rounded-lg opacity-100 shadow-lg transition-all duration-200 ease-in-out sm:h-[min(704px,calc(100%-104px))] sm:w-[600px]">
          <Chat
            chatTheme={chatTheme}
            clientApiKey={clientApiKey}
            searchParams={searchParams}
            account={"amboss"}
            botId={botId}
            messages={messages}
            setMessages={setMessages}
            conversationId={conversationId}
            setConversationId={setConversationId}
          />
        </div>
      )}
    </div>
  );
}
