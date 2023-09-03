import type { ChatThemeSettings } from "@/lib/chat-theme";
import renderMessage from "@/lib/services/render-message";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  streamingInProgress: boolean | undefined;
  text: string;
};

export default function AgentMessage({
  chatTheme,
  streamingInProgress,
  text
}: AgentMessageProps): JSX.Element {
  console.log("steraming: ", streamingInProgress);
  return (
    <p
      className={`${
        chatTheme.assistantMessageSetting.text
      } text-[90%] sm:text-[100%] ${
        streamingInProgress &&
        `!last:after:mt-1 last:after:animate-assistant-message  last:after:bg-white last:after:text-white last:after:content-['▋']`
      }`}
      dangerouslySetInnerHTML={{ __html: renderMessage(text) }}></p>
  );
}
