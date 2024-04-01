"use client";
import { useState } from "react";
import Chat, { type SearchParams } from "@/components/chat/index-widget";
import { identifyVisitor } from "@/lib/visitor/identify";
import type { Bot } from "@prisma/client";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import prisma from "@/lib/prisma";

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
  const [lastConversationId, setLastConversationId] = useState<
    string | undefined
  >(undefined);

  async function handleWidgetClick() {
    // identify user on widget transition to open
    if (!widgetOpen) {
      const sessionId = await identifyVisitor(bot.id);

      const lastConvoId = await prisma.conversation.findFirst({
        where: { widgetSessionId: sessionId },
        orderBy: { created_at: "desc" },
        select: { id: true }
      });
      if (lastConvoId) {
        setLastConversationId(lastConvoId.id.toString());
      }
    }
    setWidgetOpen(!widgetOpen);
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
            lastConversationId={lastConversationId}
          />
        </div>
      )}
      <div className="fixed bottom-3 right-3 z-50 h-14 w-14 origin-center select-none transition-transform duration-200 ease-in">
        <div className="absolute left-0 top-0 h-14 w-14 cursor-pointer overflow-hidden rounded-full antialiased">
          <button
            onClick={handleWidgetClick}
            aria-label="Open support widget"
            className="h-full w-full">
            <div className="absolute bottom-0 top-0 flex w-full select-none items-center justify-center opacity-100">
              {widgetOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                  fill="currentColor"
                  className="transform transition-transform duration-200 hover:scale-[1.08]">
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                  fill="currentColor"
                  className="transform transition-transform duration-200 hover:scale-[1.08]">
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /* <iframe
  src="https://apps.wiselydesk.com/chat/demo?client_api_key=hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE&model=gpt-3.5-turbo&create_support_ticket=true"
  name="wiselydesk-launcher"
  title="WiselyDesk Chat"
  role="dialog"
  className="h-16 w-16 rounded-full border shadow-lg" 
/> */
}
