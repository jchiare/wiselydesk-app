import { combineClassNames, type ChatThemeSettings } from "@/lib/chat-theme";
import AgentIcon from "@/components/agent/icon";
import AgentMessage from "@/components/agent/message";
import Sources from "@/components/agent/sources";
import SupportTicketModal from "@/components/support-ticket-modal";

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
                  blinkCursor={true}
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
                {/* {shouldDisplaySource && (
                  <div className=" ml-auto mt-6 w-fit rounded-lg bg-slate-600 p-4 text-[0.8rem] leading-5 sm:text-sm">
                    <p style={{ marginTop: "0.25em", marginBottom: "0.25em" }}>
                      {germanSource !== null ? "Quellen:" : "Sources:"}
                    </p>
                    {sources &&
                      sources !== null &&
                      sources.map((source, index) => {
                        return (
                          <>
                            <Link
                              target="_blank"
                              key={`${source}${index}`}
                              href={source}
                            >
                              {sourceText(source, index)}
                            </Link>
                            <br />
                          </>
                        );
                      })}
                  </div>
                )} */}
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
          )}
          {!isWelcomeMessage && (
            <>
              <hr />
              <div className="flex justify-between p-2">
                <div className="flex flex-row items-center gap-2">
                  <svg
                    width="16"
                    height="15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="0.5"
                      width="16"
                      height="14"
                      rx="4"
                      fill="#737373"
                    ></rect>
                    <path
                      d="M6.181 11.1H7.9L6.142 4.9H4.213L2.46 11.1h1.564l.297-1.362h1.572l.288 1.362zM5.077 6.296h.082l.49 2.307h-1.08l.508-2.307zm7.635 4.804V9.832h-1.306V6.167h1.306V4.899H8.527v1.268h1.307v3.665H8.527V11.1h4.185z"
                      fill="#fff"
                    ></path>
                  </svg>
                  <span>{aiAnswerHelpText?.text}</span>
                </div>
                <div
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 hover:cursor-help"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  {showTooltip && (
                    <div className="absolute bottom-10 left-0 mt-6 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-md">
                      {aiAnswerHelpText?.explanation}
                    </div>
                  )}
                </div>
              </div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}
