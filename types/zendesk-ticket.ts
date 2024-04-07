type UserSummary = {
  locale?: string;
  education?: string;
  examCategory?: string;
  examType?: string;
  current_access?: string;
  studyObjective?: string;
  profession?: string;
};

export type BaseTicket = {
  userSummary: UserSummary;
  url: string;
  id: number;
  external_id: null | string;
  via: {
    channel: string;
    source: any;
  };
  created_at: Date;
  updated_at: Date;
  generated_timestamp?: number;
  type: null | string;
  subject: string | null;
  raw_subject: string | null;
  description: string;
  priority: null | string;
  status: string;
  recipient: null | string;
  requester_id: number;
  submitter_id: number;
  assignee_id: number | null;
  organization_id: null | number;
  group_id: number;
  collaborator_ids: number[];
  follower_ids: number[];
  email_cc_ids: number[];
  forum_topic_id: null | number;
  problem_id: null | number;
  has_incidents: boolean;
  is_public: boolean;
  due_at: null | string;
  tags: string[];
  custom_fields: any[];
  satisfaction_rating: null | any;
  sharing_agreement_ids: number[];
  custom_status_id: number;
  fields: any[];
  followup_ids: number[];
  ticket_form_id: number;
  brand_id: number;
  allow_channelback: boolean;
  allow_attachments: boolean;
  from_messaging_channel: boolean;
  result_type?: string;
};

type Audit = {
  id: number;
  ticket_id: number;
  created_at: string;
  author_id: number;
  metadata: {
    system: any;
    custom: Record<string, any>;
  };
  events: any[];
  via: {
    channel: string;
    source: any;
  };
};

export type ZendeskTicket = {
  ticket: BaseTicket;
  audit: Audit;
};
