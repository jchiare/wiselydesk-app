import { type ChatThemeSettings } from "@/lib/chat/chat-theme";
import AgentIcon from "@/components/chat/agent/icon";
import AgentMessage from "@/components/chat/agent/message";
import Sources from "@/components/chat/agent/sources";
import SupportTicketModal from "@/components/chat/support-ticket-modal";
import AiWarning from "@/components/chat/ai-warning";
import Feedback from "@/components/chat/agent/feedback";
import { removeSupportButton } from "@/lib/shared/services/render-message";
import type { Bot } from "@prisma/client";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  text: string;
  locale: string;
  sources?: string[];
  account?: string;
  aiResponseDone: boolean;
  isLastMessage: boolean;
  latestMessageId?: number | null | undefined;
  conversationId?: string;
  createSupportTicket?: boolean;
  bot: Bot;
};

export default function AgentDiv({
  chatTheme,
  text,
  sources,
  locale,
  account,
  aiResponseDone,
  isLastMessage,
  latestMessageId,
  conversationId,
  createSupportTicket,
  bot
}: AgentMessageProps): JSX.Element {
  const [_, buttonCreateHtml] = removeSupportButton(text);

  const displaySupportModal =
    buttonCreateHtml && aiResponseDone && isLastMessage && createSupportTicket;
  return (
    <div
      className={`w-full border-b ${
        chatTheme.assistantMessageSetting.bgColour +
        " " +
        chatTheme.assistantMessageSetting.text
      }`}>
      <div className="m-auto flex gap-4 p-2 sm:p-4 md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <AgentIcon chatTheme={chatTheme} />

        <div className="relative flex w-full flex-col gap-1 sm:w-[calc(100%-50px)] md:gap-3 lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap ">
              <div className="prose prose-invert w-full break-words ">
                <AgentMessage
                  chatTheme={chatTheme}
                  aiResponseDone={aiResponseDone}
                  text={text}
                  isLastMessage={isLastMessage}
                />
                {displaySupportModal && (
                  <SupportTicketModal
                    conversationId={conversationId}
                    botId={bot.id}
                  />
                )}

                <Sources
                  sources={sources}
                  account={account}
                  locale={locale}
                  aiResponseDone={aiResponseDone}
                />
              </div>
            </div>
          </div>
          <Feedback
            isLastMessage={isLastMessage}
            chatTheme={chatTheme}
            messageId={latestMessageId}
          />
          <AiWarning account={account} locale={locale} />
        </div>
      </div>
    </div>
  );
}
