import type { ChatThemeSettings } from "@/lib/chat-theme";
import renderMessage from "@/lib/services/render-message";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  blinkCursor: boolean;
  text: string;
};

export default function AgentMessage({
  chatTheme,
  blinkCursor,
  text,
}: AgentMessageProps): JSX.Element {
  return (
    <p
      className={`${
        chatTheme.assistantMessageSetting.text
      } text-[90%] sm:text-[100%] ${
        blinkCursor &&
        `!last:after:mt-1 last:after:animate-assistant-message  last:after:bg-white last:after:text-white last:after:content-['▋']`
      }`}
      dangerouslySetInnerHTML={{ __html: renderMessage(text) }}
    ></p>
  );
}
