import type { KnowledgeBaseArticle as PrismaKnowledgeBaseArticle } from "@prisma/client";

type OptionalFields = "id" | "deleted_at" | "created_at" | "updated_at";

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

export class ExternalZendeskArticle {
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

  constructor(data: {
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
  }) {
    this.id = data.id!;
    this.url = data.url!;
    this.htmlUrl = data.html_url!;
    this.authorId = data.author_id!;
    this.commentsDisabled = data.comments_disabled!;
    this.draft = data.draft!;
    this.promoted = data.promoted!;
    this.position = data.position!;
    this.voteSum = data.vote_sum!;
    this.voteCount = data.vote_count!;
    this.sectionId = data.section_id!;
    this.createdAt = data.created_at!;
    this.updatedAt = data.updated_at!;
    this.name = data.name!;
    this.title = data.title!;
    this.sourceLocale = data.source_locale!;
    this.locale = data.locale!;
    this.outdated = data.outdated!;
    this.outdatedLocales = data.outdated_locales!;
    this.editedAt = data.edited_at!;
    this.userSegmentId = data.user_segment_id;
    this.permissionGroupId = data.permission_group_id!;
    this.contentTagIds = data.content_tag_ids!;
    this.labelNames = data.label_names!;
    this.body = data.body!;
  }
}
