import {
  combineClassNames,
  type ChatThemeSettings
} from "@/lib/chat/chat-theme";

export default function User({
  text,
  chatTheme
}: {
  text: string;
  chatTheme: ChatThemeSettings;
}): JSX.Element {
  return (
    <div
      className={`w-full border-b border-gray-900/50 ${combineClassNames(
        chatTheme.userMessageSetting
      )}`}>
      <div className="flex gap-4 px-5 py-4">
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
