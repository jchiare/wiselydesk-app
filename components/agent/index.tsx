import { combineClassNames, type ChatThemeSettings } from "@/lib/chat-theme";
import AgentIcon from "@/components/agent/icon";
import AgentMessage from "@/components/agent/message";
import Sources from "@/components/agent/sources";
import SupportTicketModal from "@/components/support-ticket-modal";
import AiWarning from "@/components/ai-warning";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  text: string;
  locale: string;
  sources?: string[];
  account?: string;
  streamingInProgress?: boolean;
};

// const shouldDisplaySupportTicket =
//   foundSupportTicketRegex &&
//   assistantResponseFinished &&
//   isLastMessage &&
//   createSupportTicket;

export default function AgentDiv({
  chatTheme,
  text,
  sources,
  locale,
  account,
  streamingInProgress
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
                  streamingInProgress={streamingInProgress}
                  text={text}
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
                  streamingInProgress={streamingInProgress}
                />
              </div>
            </div>
          </div>
          {/* {isLastMessage ? (
            <div className="hidden justify-between sm:flex">
              <div className="visible mt-2 flex justify-center gap-3 self-end text-gray-400 md:gap-4 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:translate-x-full lg:gap-1 lg:self-center lg:pl-2">
                <button
                  className={`rounded-md p-1 ${assistantMessageSettings.feedbackColour} hover:bg-gray-700 hover:text-gray-200 disabled:hover:text-gray-400`}
                  onClick={() =>
                    sendFeedback({ isHelpful: true, id, apiBaseUrl })
                  }
                >
                  <svg
                    stroke="currentColor"
                    fill={pressedThumb === "up" ? "white" : "none"}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </button>
                <button
                  className={`rounded-md p-1 ${assistantMessageSettings.feedbackColour} hover:bg-gray-700  hover:text-gray-200 disabled:hover:text-gray-400`}
                  onClick={() =>
                    sendFeedback({ isHelpful: false, id, apiBaseUrl })
                  }
                >
                  <svg
                    stroke="currentColor"
                    fill={pressedThumb === "down" ? "white" : "none"}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}*/}
          <AiWarning account={account} locale={locale} />
        </div>
      </div>
    </div>
  );
}
