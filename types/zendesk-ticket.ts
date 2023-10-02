type Ticket = {
  url: string;
  id: number;
  external_id: null | string;
  via: {
    channel: string;
    source: any;
  };
  created_at: string;
  updated_at: string;
  type: null | string;
  subject: string;
  raw_subject: string;
  description: string;
  priority: null | string;
  status: string;
  recipient: null | string;
  requester_id: number;
  submitter_id: number;
  assignee_id: number;
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
  ticket: Ticket;
  audit: Audit;
};
