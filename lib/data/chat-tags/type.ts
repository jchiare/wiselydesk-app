export type ChatTagsElement = {
  name: string;
  children: string[];
};

export type ChatTagsType = {
  tags: ChatTagsElement;
  ai_generated_tags: ChatTagsElement;
};

export type ChatTagsResponse = {
  tags: ChatTagsElement;
  aiGeneratedTags: ChatTagsElement;
};
