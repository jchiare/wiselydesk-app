import type { Conversation } from "@prisma/client";

export type SingleConversationReturnType = {
  conversation: ConversationType;
};

export type Message = {
  bot_id: number;
  conversation_id: number;
  created_at: string;
  deleted_at: string | null;
  from_user_id: number;
  updated_at: string;
  index: number;
  id: number;
  text: string;
  sources: string;
  is_helpful: boolean | null;
};

export type ConversationType = { messages: Array<Message> } & Conversation;
