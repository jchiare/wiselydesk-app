"use client";
import { useState } from "react";
import Chat, { type SearchParams } from "@/components/widget/chat";
import { identifyVisitor, getLastConversation } from "@/lib/visitor/identify";
import { useAtom } from "jotai";
import { conversationIdAtom } from "@/lib/state/atoms";
import type { Bot, Conversation } from "@prisma/client";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";

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
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [lastConversation, setLastConversation] = useState<
    Conversation | undefined
  >(undefined);
  const [conversationId, _] = useAtom(conversationIdAtom);

  async function handleWidgetClick() {
    try {
      setWidgetOpen(currentState => !currentState);

      // const sessionId = await identifyVisitor(bot.id);

      // // If widget is transitioning to open and there's no last conversation cached
      // if (!widgetOpen && !lastConversation) {
      //   const fetchedLastConversation = await getLastConversation(sessionId);
      //   if (fetchedLastConversation) {
      //     setLastConversation(fetchedLastConversation);
      //     return;
      //   }
      // }

      // if (widgetOpen && conversationId) {
      //   await endConversation(conversationId);
      //   setLastConversation(undefined);
      // }
    } catch (err) {
      console.error("Error handling widget click:", err);
    }
  }

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
      {bot && widgetOpen && (
        <div className="transform-origin[bottom_right] pointer-events-auto fixed bottom-20 right-5 z-[2147483000] h-[min(704px,calc(100%-104px))] max-h-[704px] min-h-[80px] w-[600px] overflow-hidden rounded-lg opacity-100 shadow-lg transition-all duration-200 ease-in-out">
          <Chat
            chatTheme={chatTheme}
            clientApiKey={clientApiKey}
            searchParams={searchParams}
            account={"amboss"}
            bot={bot}
            lastConversation={lastConversation}
          />
        </div>
      )}
      <div className="fixed bottom-3 right-3 z-50 h-14 w-14 origin-center select-none transition-transform duration-200 ease-in hover:scale-[1.08]">
        <div className="absolute left-0 top-0 h-14 w-14 cursor-pointer overflow-hidden rounded-full antialiased">
          <button
            onClick={() => handleWidgetClick()}
            aria-label="Open support widget"
            className="h-full w-full">
            <div className="absolute bottom-0 top-0 flex w-full select-none items-center justify-center bg-[#0AA6B8] opacity-100">
              {widgetOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                  className="transform transition-transform duration-200 hover:scale-[1.08]">
                  {/* Circle path */}
                  <path
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z"
                    fill="#0AA6B8"
                  />
                  {/* "X" path */}
                  <path
                    d="M10.28 9.22a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  width="38"
                  height="32"
                  viewBox="2 0 32 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.89605 14.6795L6.33126 16.303C6.71766 16.5615 6.94979 16.9965 6.94979 17.4594V24.4092C6.94979 25.1764 7.57388 25.7991 8.33974 25.7991H27.7991C28.5664 25.7991 29.1891 25.1764 29.1891 24.4092V4.94978C29.1891 4.18391 28.5664 3.55982 27.7991 3.55982H8.33974C7.57388 3.55982 6.94979 4.18391 6.94979 4.94978V11.8996C6.94979 12.3638 6.71766 12.7975 6.33126 13.056L3.89605 14.6795ZM27.7991 28.5791H8.33974C6.04075 28.5791 4.16987 26.7096 4.16987 24.4092V18.2044L0.619921 15.8359C0.232123 15.5774 0 15.1437 0 14.6795C0 14.2152 0.232123 13.7816 0.619921 13.523L4.16987 11.1559V4.94978C4.16987 2.65079 6.04075 0.779907 8.33974 0.779907H27.7991C30.0995 0.779907 31.969 2.65079 31.969 4.94978V24.4092C31.969 26.7096 30.0995 28.5791 27.7991 28.5791Z"
                    fill="white"
                  />
                  <circle cx="12" cy="15" r="2" fill="white" />
                  <circle cx="18" cy="15" r="2" fill="white" />
                  <circle cx="24" cy="15" r="2" fill="white" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
