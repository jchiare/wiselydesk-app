type tagsEl = {
  name: string;
  children: string[];
};

export type ChatTagsType = {
  tags: tagsEl;
  ai_generated_tags: tagsEl;
};
