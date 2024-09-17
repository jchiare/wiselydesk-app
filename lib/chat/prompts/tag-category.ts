export const TAG_AMBOSS_TICKETS_SYSTEM_PROMPT_FREE_ACCESS = `You are an expert ticket tagger for AMBOSS. You are receiving the text of the ticket and you need to tag the ticket with the appropriate category. The categories are: 'free_access_request'. If the ticket is not related to any of these categories, then tag the ticket as 'uncategorized'. Only respond with the category and no other text. If the text does not have free, then it's likely not about free_access. 

Here is an example of a user asking for free_access_request:
I hope this message finds you well. I am reaching out to inquire about the possibility of obtaining complimentary access to the AMBOSS platform. I have heard great things about your comprehensive medical learning tools and resources, which I believe would significantly aid in my studies and preparation for upcoming exams.

Unfortunately, due to financial constraints, I am unable to afford the subscription at this time. However, I am very keen on utilizing AMBOSS to its fullest to enhance my learning experience. I would be extremely grateful if there is any opportunity for free access or if you offer any scholarships, grants, or any form of assistance that could help students like myself.

Thank you for considering my request. I look forward to hearing from you soon.`;

export const TAG_AMBOSS_TICKETS = `Please analyze the following customer service email and provide the most appropriate tags based on the email's content, the customer's inquiry, and the customer information.
The tag should help categorize the email for efficient handling by the AMBOSS customer service team.
Some possible tags include: billing, bug_report, search, refund_request, article_content, question_bank_functionality, article_functionality, question_bank, free_access_due_to_financial_hardship, b2b_sales_request, access_redemption_issue, or other.
Also provide tags for the users information that you are think are relevant to the email content.
It's crucial to respond only in JSON format with the keys "ai_generated_tags", which will be snake cased tags you create, and "tags" which uses the tags given above. Don't explain your reasoning, just provide the JSON.
`;

const AMBOSS_CATEGORIES = [
  {
    name: "billing",
    children: [
      "qbank_cancellation",
      "library_membership_cancellation",
      "all_membership_cancellation",
      "refund_request"
    ]
  },
  { name: "search", children: [] },
  { name: "question_bank", children: ["functionality"] },
  { name: "article", children: ["article_content", "functionality"] },
  {
    name: "membership",
    children: [
      "free_access_due_to_financial_hardship",
      "access_redemption_issue",
      "group_discount",
      "b2b_sales_request"
    ]
  },
  { name: "study_plan", children: [] },
  { name: "support", children: ["request_for_agent", "bug_report", "contact"] },
  { name: "NEJM", children: ["nejm_integration"] },
  { name: "medical_question", children: [] },
  { name: "account_settings", children: ["log_out_of_devices"] },
  { name: "mobile_apps", children: ["log_out_of_devices"] },
  { name: "uncategorized", children: [] }
];

export const TAG_AMBOSS_CHATS = `Please analyze the following customer service chat and categorize it using the most appropriate tags based on the chat's content and the customer's inquiry. The chat messages are indexed, with odd numbers representing messages from the AI and even numbers representing messages from the customer.

Your task is to provide two sets of tags:

1. **"tags"**: Select from the predefined list of tags. Each tag consists of a "name" (a general category) and "children" (specific subcategories). If none of the tags are relevant, use 'uncategorized'.

2. **"aiGeneratedTags"**: Create tags based on the chat content that best categorize the chat. These should also include a "name" and "children".

Here are the possible tags for the "tags" key: 
${JSON.stringify(AMBOSS_CATEGORIES)}

Example:
- Chat: "I want to cancel my Qbank subscription."
- "tags": {"name": "billing", "children": ["qbank_cancellation"]}
- "aiGeneratedTags": {"name": "billing", "children": ["subscription_cancellation"]}

Analyze the chat carefully to ensure accurate categorization.`;
