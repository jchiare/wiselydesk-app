export type SingleConversationReturnType = {
  conversation: Conversation;
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

export type Conversation = {
  bot_id: number;
  created_at: string;
  deleted_at: string | null;
  id: number;
  messages: Array<Message>;
  public_id: number;
  summary: string;
  updated_at: string;
  user_id: number;
};
