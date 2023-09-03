import { combineClassNames, type ChatThemeSettings } from "@/lib/chat-theme";

function formatSentTime(time: string | undefined): string | undefined {
  return time?.charAt(0) === "0" ? time.slice(1) : time;
}

export default function User({
  sentTime,
  text,
  chatTheme,
}: {
  sentTime: string | undefined;
  text: string;
  chatTheme: ChatThemeSettings;
}): JSX.Element {
  const formattedTime = formatSentTime(sentTime);

  return (
    <div
      className={`w-full border-b border-gray-900/50 ${combineClassNames(
        chatTheme.userMessageSetting,
      )}`}
    >
      <div className="m-auto flex gap-4 p-2 sm:p-4 md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="relative hidden w-[30px] flex-col items-end sm:flex">
          <span className="m-0 inline-block h-auto w-auto max-w-full overflow-hidden border-0 bg-none p-0 opacity-100">
            <span className="m-0 block h-auto w-auto max-w-full border-0 bg-none p-0 opacity-100">
              <svg width="30" height="30" viewBox="0 0 30 30">
                <rect
                  rx="2"
                  ry="2"
                  x="0"
                  y="0"
                  width="30"
                  height="30"
                  fill="#5485d1"
                />
                <text fill="#ffffff" x="30%" y="70%">
                  U
                </text>
              </svg>
            </span>
          </span>
        </div>
        <div className="relative flex w-full flex-col gap-1 sm:w-[calc(100%-50px)] md:gap-3 lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
