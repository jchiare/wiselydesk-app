import { type ChatThemeSettings } from "@/lib/chat-theme";
import AgentIcon from "@/components/agent/icon";
import AgentMessage from "@/components/agent/message";
import Sources from "@/components/agent/sources";
import SupportTicketModal from "@/components/support-ticket-modal";
import AiWarning from "@/components/ai-warning";
import Feedback from "@/components/agent/feedback";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  text: string;
  locale: string;
  sources?: string[];
  account?: string;
  aiResponseDone: boolean;
  isLastMessage: boolean;
  latestMessageId?: number | null | undefined;
};

// const shouldDisplaySupportTicket =
//   foundSupportTicketRegex &&
//   aiResponseDone &&
//   isLastMessage &&
//   createSupportTicket;

export default function AgentDiv({
  chatTheme,
  text,
  sources,
  locale,
  account,
  aiResponseDone,
  isLastMessage,
  latestMessageId
}: AgentMessageProps): JSX.Element {
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
                {/* <SupportTicketModal /> */}
                {/* <SupportTicketSystem
                  shouldDisplay={shouldDisplaySupportTicket}
                  apiBaseUrl={apiBaseUrl}
                  conversationId={conversationId}
                /> */}
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
