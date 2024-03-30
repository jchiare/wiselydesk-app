import type { BaseTicket } from "@/types/zendesk-ticket";

export type ZendeskSearchAPIResponse = {
  results: BaseTicket[];
  facets: null;
  next_page: null;
  previous_page: null;
  count: number;
};

export type Field = {
  id: number;
  value: boolean | null | string;
};

export type SatisfactionRating = {
  score: string;
};

export type Via = {
  channel: string;
  source: Source;
};

export type Source = {
  from: From;
  to: From;
  rel: null;
};

export type From = {};
