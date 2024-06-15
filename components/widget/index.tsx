"use client";
import { useState } from "react";
import Chat, { type SearchParams } from "@/components/widget/chat";
import { identifyVisitor, getLastConversation } from "@/lib/visitor/identify";
import { useAtom } from "jotai";
import { conversationIdAtom } from "@/lib/state/atoms";
import type { Bot, Conversation } from "@prisma/client";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import type ChatMessage from "@/lib/chat/chat-message";

export function Widget({
  clientApiKey,
  searchParams,
  bot,
  chatTheme
}: {
  clientApiKey: string;
  searchParams: SearchParams;
  bot: Bot;
  chatTheme: ChatThemeSettings;
}): JSX.Element {
  const { widgetOpen } = searchParams;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  // const [conversationId, _] = useAtom(conversationIdAtom);

  async function endConversation(conversationId: number) {
    try {
      await fetch(`/api/conversation/${conversationId}/end`, {
        method: "POST"
      });
    } catch (err) {
      console.error("Error ending conversation:", err);
    }
  }

  return (
    <div>
      {bot && widgetOpen && widgetOpen === "true" && (
        <div className="transform-origin[bottom_right] pointer-events-auto fixed bottom-[100px] right-5 z-10 h-[min(704px,calc(100%-104px))] max-h-[625px] min-h-[80px] w-[600px] overflow-scroll rounded-lg opacity-100 shadow-lg transition-all duration-200 ease-in-out">
          <Chat
            chatTheme={chatTheme}
            clientApiKey={clientApiKey}
            searchParams={searchParams}
            account={"amboss"}
            bot={bot}
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
