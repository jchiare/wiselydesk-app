import type { ChatTagsType, ChatTagsResponse } from "./type";

export function formatChatTags(chatTags: ChatTagsType): ChatTagsResponse {
  return {
    tags: chatTags.tags,
    aiGeneratedTags: chatTags.ai_generated_tags
  };
}
