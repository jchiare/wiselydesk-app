import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import renderMessage from "@/lib/shared/services/render-message";

type AgentMessageProps = {
  chatTheme: ChatThemeSettings;
  aiResponseDone: boolean | undefined;
  text: string;
  isLastMessage: boolean;
  isPreviousMessages?: boolean;
};

export default function AgentMessage({
  chatTheme,
  aiResponseDone,
  text,
  isLastMessage,
  isPreviousMessages
}: AgentMessageProps): JSX.Element {
  const htmlText = renderMessage(text);
  return (
    <p
      className={`${chatTheme.assistantMessageSetting.text} text-black ${
        !aiResponseDone &&
        isLastMessage &&
        !isPreviousMessages &&
        `!last:after:mt-1 last:after:animate-assistant-message  last:after:bg-white last:after:text-black last:after:content-['▋']`
      }`}
      // @ts-expect-error some htmlthing
      dangerouslySetInnerHTML={{ __html: htmlText }}></p>
  );
}
