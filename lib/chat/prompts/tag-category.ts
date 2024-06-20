export const TAG_AMBOSS_TICKETS_SYSTEM_PROMPT_FREE_ACCESS = `You are an expert ticket tagger for AMBOSS. You are receiving the text of the ticket and you need to tag the ticket with the appropriate category. The categories are: 'free_access_request'. If the ticket is not related to any of these categories, then tag the ticket as 'uncategorized'. Only respond with the category and no other text. If the text does not have free, then it's likely not about free_access. 

Here is an example of a user asking for free_access_request:
I hope this message finds you well. I am reaching out to inquire about the possibility of obtaining complimentary access to the AMBOSS platform. I have heard great things about your comprehensive medical learning tools and resources, which I believe would significantly aid in my studies and preparation for upcoming exams.

Unfortunately, due to financial constraints, I am unable to afford the subscription at this time. However, I am very keen on utilizing AMBOSS to its fullest to enhance my learning experience. I would be extremely grateful if there is any opportunity for free access or if you offer any scholarships, grants, or any form of assistance that could help students like myself.

Thank you for considering my request. I look forward to hearing from you soon.`;

export const TAG_AMBOSS_TICKETS = `Please analyze the following customer service email and provide the most appropriate tags based on the email's content, the customer's inquiry, and the customer information.
The tag should help categorize the email for efficient handling by the AMBOSS customer service team.
Some possible tags include: billing, bug_report, search, refund_request, article_content, question_bank_functionality, article_functionality, question_bank, free_access_due_to_financial_hardship, b2b_sales_request, or other.
Also provide tags for the users information that you are think are relevant to the email content.
It's crucial to respond only in JSON format with the keys "ai_generated_tags", which will be snake cased tags you create, and "tags" which uses the tags given above. Don't explain your reasoning, just provide the JSON.
`;

const TAG_CATEGORIES =
  "qbank_cancellation, library_membership_cancellation, all_membership_cancellation, bug_report, search, refund_outside_policy, refund_possibly_in_policy, article_content, question_bank_functionality, nejm_integration, article_functionality, question_bank, free_access_due_to_financial_hardship, study_plan_help, log_out_of_devices, b2b_sales_request, troubleshooting, feature_request, or other";
export const TAG_AMBOSS_CHATS = `
Please analyze the following customer service chat and provide the most appropriate tags based on the chats content and customer inquiry. All odd indexed messages are from the AI and even indexed messages are from the customer.
The tag should help categorize the email for efficient handling by the AMBOSS customer service team.
Some possible tags include: ${TAG_CATEGORIES}.
Also provide tags for the users information that you are think are relevant to the chat content.
It's crucial to respond only in JSON format with the keys "ai_generated_tags", which will be snake cased tags you create, and "tags" which uses the tags given above. Don't explain your reasoning, just provide the JSON.
  `;
