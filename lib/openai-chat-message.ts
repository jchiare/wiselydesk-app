import ChatMessage from "@/lib/chat-message";

type Role = "user" | "assistant";

type OpenAiMessage = {
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
