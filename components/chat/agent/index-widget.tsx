import { type ChatThemeSettings } from "@/lib/chat/chat-theme";
import AgentIcon from "@/components/chat/agent/icon";
import AgentMessage from "@/components/chat/agent/message";
import Sources from "@/components/chat/agent/sources-widget";
import SupportTicketModal from "@/components/chat/support-ticket-modal";
import AiWarning from "@/components/chat/ai-warning-widget";
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
  testSupportModal?: boolean;
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
  bot,
  testSupportModal
}: AgentMessageProps): JSX.Element {
  const [_, buttonCreateHtml] = removeSupportButton(text);

  const displaySupportModal =
    testSupportModal ||
    (buttonCreateHtml &&
      aiResponseDone &&
      isLastMessage &&
      createSupportTicket);
  return (
    <div
      className={`w-full border-b ${
        chatTheme.assistantMessageSetting.bgColour +
        " " +
        chatTheme.assistantMessageSetting.text
      }`}>
      <div className="flex gap-4 px-5 py-4">
        <AgentIcon chatTheme={chatTheme} />

        <div className="relative flex flex-col gap-1 md:gap-3 ">
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
                    locale={locale}
                  />
                )}

                <Sources
                  sources={sources}
                  // @ts-expect-error done with ts for the day
                  account={account}
                  // @ts-expect-error done with ts for the day
                  locale={locale}
                  aiResponseDone={aiResponseDone}
                />
              </div>
            </div>
          </div>
          <div className="w-[calc(100%-50px)]">
            {account && <hr className="py-1" />}
            <div className="flex items-center justify-between px-2 py-0.5">
              {/* @ts-expect-error done with ts for the day */}
              <AiWarning account={account} locale={locale} />
              {aiResponseDone && (
                <Feedback
                  isLastMessage={isLastMessage}
                  chatTheme={chatTheme}
                  messageId={latestMessageId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
