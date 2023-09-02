import Image from "next/image";
import { type ChatThemeSettings } from "@/lib/chat-theme";

export default function AgentIcon({
  chatTheme,
}: {
  chatTheme: ChatThemeSettings;
}): JSX.Element {
  return (
    <div className="relative hidden w-[30px] flex-col items-end sm:flex">
      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-sm bg-white p-1 text-white">
        {chatTheme.assistantMessageSetting.icon ? (
          <Image
            width={40}
            height={40}
            alt="Assistant Icon"
            src={chatTheme.assistantMessageSetting.icon}
            priority={true}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <path
              d="M10,10 L30,90 L50,50 L70,90 L90,10"
              stroke="black"
              strokeWidth="10"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
