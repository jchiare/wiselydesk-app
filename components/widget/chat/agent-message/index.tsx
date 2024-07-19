import { type ChatThemeSettings } from "@/lib/chat/chat-theme";
import AgentIcon from "@/components/chat/agent/icon";
import AgentMessage from "@/components/widget/chat/agent-message/text";
import Sources from "@/components/widget/chat/agent-message/sources";
import SupportTicketModal from "@/components/widget/chat/support-ticket-modal";
import AiWarning from "@/components/widget/chat/agent-message/ai-warning";
import Feedback from "@/components/widget/chat/agent-message/feedback-buttons";
import { removeSupportButton } from "@/lib/shared/services/render-message";

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
  botId: number;
  testSupportModal?: boolean;
  isOverflowing?: boolean;
  hasLastConversationMessages?: boolean;
  isPreviousMessages?: boolean;
  isWelcomeMessage?: boolean;
  bgColorOverride?: string;
  supportTicketCreated?: boolean;
  setSupportTicketCreated?: any;
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
  botId,
  testSupportModal,
  isOverflowing,
  isPreviousMessages,
  isWelcomeMessage,
  bgColorOverride,
  supportTicketCreated = false,
  setSupportTicketCreated
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
        (bgColorOverride ?? chatTheme.assistantMessageSetting.bgColour) +
        " " +
        chatTheme.assistantMessageSetting.text
      } ${isLastMessage && isOverflowing ? "pb-[5.5rem]" : "pb-2"}`}>
      <div className="flex gap-4 px-5 pb-2 pt-4">
        <AgentIcon chatTheme={chatTheme} />

        <div className="relative flex flex-col gap-3 ">
          <div className="flex flex-grow flex-col gap-3">
            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap ">
              <div className="w-full break-words ">
                <AgentMessage
                  isPreviousMessages={isPreviousMessages}
                  chatTheme={chatTheme}
                  aiResponseDone={aiResponseDone}
                  text={text}
                  isLastMessage={isLastMessage}
                />
                {displaySupportModal && (
                  <SupportTicketModal
                    conversationId={conversationId}
                    botId={botId}
                    locale={locale}
                    supportTicketCreated={supportTicketCreated}
                    setSupportTicketCreated={setSupportTicketCreated}
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
          {!isWelcomeMessage && (
            <div className="w-[calc(100%-50px)]">
              {aiResponseDone && (
                <hr className="my-2 rounded-sm border-0 bg-slate-300 pt-[1px]" />
              )}
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
          )}
        </div>
      </div>
    </div>
  );
}
