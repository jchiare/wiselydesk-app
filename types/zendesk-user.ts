export interface UserFields {
  country_de_?: string | null;
  country_en_: string;
  current_access_class_de_?: string | null;
  current_access_class_en_: string;
  ig_followers?: number | null;
  ig_verified: boolean;
  last_active_platform: string;
  lldata_tickler?: string | null;
  next_exam_category_en_: string;
  next_exam_type_en_: string;
  occupation_de_?: string | null;
  occupation_en_?: string | null;
  profession_de_?: string | null;
  profession_en_: string;
  quickie_user_settings?: string | null;
  speciality_de_?: string | null;
  speciality_en_?: string | null;
  study_objective_de_?: string | null;
  study_objective_en_: string;
  target_group_de_?: string | null;
  target_group_en_: string;
  university_de_?: string | null;
  university_en_: string;
}

interface User {
  id: number;
  url: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  time_zone: string;
  iana_time_zone: string;
  phone?: string | null;
  shared_phone_number?: string | null;
  photo?: string | null;
  locale_id: number;
  locale: string;
  organization_id?: number | null;
  role: string;
  verified: boolean;
  external_id?: string | null;
  tags: string[];
  alias?: string | null;
  active: boolean;
  shared: boolean;
  shared_agent: boolean;
  last_login_at?: string | null;
  two_factor_auth_enabled?: boolean | null;
  signature?: string | null;
  details?: string | null;
  notes?: string | null;
  role_type?: number | null;
  custom_role_id?: number | null;
  moderator: boolean;
  ticket_restriction: string;
  only_private_comments: boolean;
  restricted_agent: boolean;
  suspended: boolean;
  default_group_id?: number | null;
  report_csv: boolean;
  user_fields: UserFields;
}

export type ZendeskUserDetails = {
  users: User[];
};
