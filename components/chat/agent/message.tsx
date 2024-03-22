import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import renderMessage from "@/lib/shared/services/render-message";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  aiResponseDone: boolean | undefined;
  text: string;
  isLastMessage: boolean;
};

export default function AgentMessage({
  chatTheme,
  aiResponseDone,
  text,
  isLastMessage
}: AgentMessageProps): JSX.Element {
  return (
    <p
      className={`${chatTheme.assistantMessageSetting.text} text-[90%] ${
        !aiResponseDone &&
        isLastMessage &&
        `!last:after:mt-1 last:after:animate-assistant-message  last:after:bg-white last:after:text-white last:after:content-['▋']`
      }`}
      // @ts-expect-error some htmlthing
      dangerouslySetInnerHTML={{ __html: renderMessage(text) }}></p>
  );
}
