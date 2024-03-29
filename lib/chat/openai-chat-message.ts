import ChatMessage from "@/lib/chat/chat-message";

type Role = "user" | "assistant" | "system";

export type OpenAiMessage = {
  role: Role;
  content: string;
};

export function transformChatMessageToOpenAi(
  messages: ChatMessage[]
): OpenAiMessage[] {
  return messages.map(({ sender, text }) => ({
    role: sender as Role,
    content: text
  }));
}
