import type { Conversation, Message } from "@prisma/client";

export type SingleConversationReturnType = {
  conversation: { messages: Array<Message> } & Conversation;
};
