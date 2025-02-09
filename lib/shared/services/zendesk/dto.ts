import type { KnowledgeBaseArticle as PrismaKnowledgeBaseArticle } from "@prisma/client";

type OptionalFields = "id" | "deleted_at" | "created_at" | "updated_at";

export type FolderEnhancement = {
  categoryTitle: string;
  sectionTitle: string;
};

export type KnowledgeBaseArticle = Omit<
  PrismaKnowledgeBaseArticle,
  OptionalFields
> &
  Partial<Pick<PrismaKnowledgeBaseArticle, OptionalFields>>;

export type ExternalZendeskArticlesResponse = {
  articles: ExternalZendeskArticle[];
  next_page: string | null;
  previous_page: string | null;
  count: number;
  categories?: Category[];
  sections?: Section[];
};

export type ExternalZendeskArticleResponse = {
  article: ExternalZendeskArticle;
};

export type ExpandedExternalZendeskArticle = {
  article: ExternalZendeskArticle;
  categories?: Category[];
  sections?: Section[];
};

export type Category = {
  id: number;
  url: string;
  html_url: string;
  position: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  locale: string;
  source_locale: string;
  outdated: boolean;
};

export type Section = {
  id: number;
  url: string;
  html_url: string;
  category_id: number;
  position: number;
  sorting: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  locale: string;
  source_locale: string;
  outdated: boolean;
  parent_section_id: number;
  theme_template: string;
};
export type ExternalZendeskArticle = {
  id: number;
  url: string;
  html_url: string;
  author_id: number;
  comments_disabled: boolean;
  draft: boolean;
  promoted: boolean;
  position: number;
  vote_sum: number;
  vote_count: number;
  section_id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  title: string;
  source_locale: string;
  locale: string;
  outdated: boolean;
  outdated_locales: string[];
  edited_at: string;
  user_segment_id?: number;
  permission_group_id: number;
  content_tag_ids: (number | string)[];
  label_names: string[];
  body: string;
};

export type InternalZendeskArticle = {
  id: number;
  url: string;
  htmlUrl: string;
  authorId: number;
  commentsDisabled: boolean;
  draft: boolean;
  promoted: boolean;
  position: number;
  voteSum: number;
  voteCount: number;
  sectionId: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  title: string;
  sourceLocale: string;
  locale: string;
  outdated: boolean;
  outdatedLocales: string[];
  editedAt: string;
  userSegmentId?: number;
  permissionGroupId: number;
  contentTagIds: (number | string)[];
  labelNames: string[];
  body: string;
};

export function createInternalZendeskArticle(data: {
  id?: number;
  url?: string;
  html_url?: string;
  author_id?: number;
  comments_disabled?: boolean;
  draft?: boolean;
  promoted?: boolean;
  position?: number;
  vote_sum?: number;
  vote_count?: number;
  section_id?: number;
  created_at?: Date;
  updated_at?: Date;
  name?: string;
  title?: string;
  source_locale?: string;
  locale?: string;
  outdated?: boolean;
  outdated_locales?: string[];
  edited_at?: string;
  user_segment_id?: number;
  permission_group_id?: number;
  content_tag_ids?: (number | string)[];
  label_names?: string[];
  body?: string;
}): InternalZendeskArticle {
  return {
    id: data.id!,
    url: data.url!,
    htmlUrl: data.html_url!,
    authorId: data.author_id!,
    commentsDisabled: data.comments_disabled!,
    draft: data.draft!,
    promoted: data.promoted!,
    position: data.position!,
    voteSum: data.vote_sum!,
    voteCount: data.vote_count!,
    sectionId: data.section_id!,
    createdAt: data.created_at!,
    updatedAt: data.updated_at!,
    name: data.name!,
    title: data.title!,
    sourceLocale: data.source_locale!,
    locale: data.locale!,
    outdated: data.outdated!,
    outdatedLocales: data.outdated_locales!,
    editedAt: data.edited_at!,
    userSegmentId: data.user_segment_id,
    permissionGroupId: data.permission_group_id!,
    contentTagIds: data.content_tag_ids!,
    labelNames: data.label_names!,
    body: data.body!
  };
}
