import Image from "next/image";
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
        <div className="relative flex w-[30px] flex-col items-end">
          <span className="m-0 inline-block h-auto w-auto max-w-full overflow-hidden border-0 bg-none p-0 opacity-100">
            <span className="m-0 block h-auto w-auto max-w-full border-0 bg-none p-0 opacity-100">
              <Image
                width={25}
                height={25}
                alt="User Icon"
                src={"/silhouette.png"}
                priority={true}
              />
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
