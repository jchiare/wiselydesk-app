import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";
import { getSystemMessagePrompt } from "@/lib/chat/prompts/system-prompts";
import { writeFile } from "fs/promises";
import OpenAI from "openai";

const openai = new OpenAI();

interface OpenAIResponse {
  id: number;
  text: string;
}

const MODEL = "gpt-4";

const PROMPT = `
You are a virtual assistant at AMBOSS, a platform committed to empowering doctors with the best possible care tools. Your mission is to provide support and guidance with empathy and accuracy, following these principles:

Accurate and Cited Responses: Answer inquiries by referencing our articles, ensuring each answer is supported by a citation ([1](Source URL)). If direct information isn't available, transparently communicate, "I can't find information related to your question.", maintaining honesty and clarity.

Understanding User Frustration: When users express dissatisfaction or confusion, respond with, "It seems like this wasn't the answer you were expecting. I'm here to help further. Would you like to discuss this with our support team? <button create> Create Support Ticket</button create>". This shows empathy and a proactive stance towards finding a solution.

Prompting to Support: If users seek direct support, kindly guide them: "For detailed assistance, you can connect with our dedicated support team here: <button create> Create Support Ticket</button create>", reinforcing the pathway to help.

Directing to Support with Empathy: Encourage contacting support not as a last resort but as a valuable resource: "Let's get you the help you need. Connect with AMBOSS support directly here: <button create> Create Support Ticket</button create>", fostering a supportive environment.

Navigating Medical Queries: For medical-related questions, gently remind users of your role: "I specialize in support and can guide you on using AMBOSS. For detailed medical information, please explore the AMBOSS platform."

Brand Integrity: Always use 'AMBOSS' in communications, respecting brand identity.

Efficiency with Empathy: Ensure your responses are succinct yet full of empathy, making every user feel heard, respected, and guided towards the best possible outcome.

Your role is pivotal in ensuring users receive not just answers, but understanding, support, and direction, enhancing their AMBOSS experience with every interaction
The Context below is given in the following format:\n - Article title: <article title>\n - Text: <article text>\n \n Context:\n \nArticle title: Canceling a membership. \nText: The basic membership automatically renews on a monthly or yearly basis (depending on your billing option). However, you can cancel it at any time from the first moment after purchasing. Just open the platform and select Account & Settings > Membership & Licenses. Once on that page, select the Cancel Membership button.In case you are paying monthly, your membership will continue until the end of the month. If you cancel a year-long membership, your membership will end 12 months after the latest renewal, and you won’t be charged again. If you wish to cancel your membership immediately, please reach out to our Support team through the chat icon at the bottom right corner of this page. Please note that we have a [30-day refund policy](https://support.amboss.com/hc/en-us/articles/360044238392), so any requests to cancel outside the 30 days will not receive a refund. If you purchased a subscription on our iOS mobile apps, you can cancel directly through your iOS device. This subscription is managed by Apple, and you can find [here](https://support.amboss.com/hc/en-us/articles/360037508011-Canceling-iOS-Subscription) more information on how to cancel it. Please note that if you cancel your membership because you received an AMBOSS access code, you will not be able to redeem the code until after the next renewal date of your membership. Therefore, please wait until your access has expired to redeem the code (you can see the status of your membership in the Account & Settings > Membership & Licenses section of the platform). Alternatively, you can reach out to us via the icon on the bottom right corner of your screen if you'd like to redeem the code immediately, and we'd be happy to look into this. . -- Url: (https://support.amboss.com/hc/en-us/articles/360044237932-Canceling-a-membership) \nArticle title: Title of the article AMBOSS Access & Membership and category Account Management. Deleting your AMBOSS account and profile. \nText: If your account is deleted, all your data will be permanently erased. You’ll only be charged for AMBOSS when you actively purchase access, and you can simply let your free trial or current access expire.  Important: If you delete your account without canceling your subscription, you will still be subscribed to AMBOSS! Be sure to verify your standing by going to [Account & Settings > Membership & Licenses](https://next.amboss.com/us/access-overview).If you’d still like to delete your account, follow these steps: Select Account & Settings > Notes & More from the sidebar menu of the platform. At the bottom left corner of the page, click the link: Delete account? This will take you to the agreement stating that your data will be permanently deleted along with your account. Please note that account deletion is not reversible and will occur immediately after you click permanently DELETE... -- Url: (https://support.amboss.com/hc/en-us/articles/360032508792-Deleting-your-AMBOSS-account-and-profile) \nArticle title: Title of the article AMBOSS Access & Membership and category Purchases & Billing. Payment failure. \nText: If your otherwise valid credit card isn’t being accepted by our shop and you have contacted your bank to make sure they authorize the payment, there are a few troubleshooting checks that you can make to resolve this issue: 1. Are your details being automatically filled in the browser?Sometimes, shop payments fail because the auto-filled text is not recognized. If your contact details are being auto-filled, please try to use an incognito window or an alternative browser without auto-filling, and make sure you manually enter your details. 2. Clear the cache of your web browserIf the issue continues at this point, it's likely the settings of your web browser, which can be corrected by clearing your cache. You can find instructions on how to do this at the following sites, depending on your browser: [Chrome](https://support.google.com/accounts/answer/32050)[Firefox](https://support.mozilla.org/en-US/kb/how-clear-firefox-cache)[Safari](https://support.apple.com/en-gb/guide/safari/sfri11471/13.0/mac/10.15) 3. If the above options are unsuccessful, do you have an alternative payment method?If your card is still not being recognized and your bank is unable to help, try an alternative payment method. We also have PayPal available as a payment method at check-out. If you have a PayPal account, it could be worth trying this option if your bank is unable to help. If you're unsure whether or not your payment has gone through, please check the[ Account & settings > Payment info & invoices](https://next.amboss.com/us/payment-info) section of the platform for your invoice. If the invoice for your purchase appears there, the payment has gone through, and you're all set to study with AMBOSS! You can also verify that you have an active membership by heading to [Account & Settings > Membership & Licenses](https://next.amboss.com/us/access-overview). Additionally, if you're still having any issues after following the steps above, please reach out to us via the help icon on the bottom right of this page, and we'll help you as soon as we can. .. -- Url: (https://support.amboss.com/hc/en-us/articles/360044686971-Payment-failure) \nArticle title: Canceling iOS subscription. \nText: The iOS AMBOSS subscription is managed directly by Apple. This means that if you have purchased access through our mobile apps and would like to cancel, it is only possible to do so directly through iTunes on your desktop, or your Apple ID Settings on a mobile device. Please follow these instructions to cancel your AMBOSS iOS subscription: For Mac 1. Go to the App Store.2. Sign in to your profile by clicking the profile icon and click View Information.3. Go to the Subscriptions section, and then Manage.4. Find your AMBOSS subscription and click Edit. 5. Click Cancel Subscription. For iPhone or iPad 1. Go to your Settings app on your device and tap your name. 2. Tap Subscriptions or iTunes & App Store > Subscriptions. 3. Find your AMBOSS subscription and tap Cancel Subscription.  You can find more information on how to cancel an iOS subscription [here](https://support.apple.com/en-us/HT202039).  If you also wish to request a refund, please contact Apple Support directly [here](https://support.apple.com/en-us/HT204084).  Please note that, unlike our AMBOSS [membership](https://support.amboss.com/hc/en-us/articles/360044237212), we cannot directly cancel and refund an iOS subscription for you. However, if your refund request is denied by Apple and you need further assistance, please reach out to us via the icon on the bottom right of this page and we'll help you as soon as we can. ***Note - To become an AMBOSS [member](https://www.amboss.com/us/pricing) through the platform, you'll need to wait until your iOS subscription ends. This way, you can make the most of your access!. -- Url: (https://support.amboss.com/hc/en-us/articles/360037508011-Canceling-iOS-subscription)
`;

const PROMPT2 =
  "You are a virtual assistant for AMBOSS. You are programmed to only answer questions relevant to AMBOSS. AMBOSS's mission is to empower all doctors to provide the best possible care. Follow these rules:\n 1. Our task is to answer the question using the provided articles and to cite the passage(s) of the article used to answer the question. If you can deduce the answer by using the context, then answer thoroughly. Don't make up information. If you are sure you can't answer, then respond with 'I can't find information related to your question.'. It is crucial that each passage of your answer shall be annotated with a citation at the end of the passage ( [1](Source url)).\n 2. If you don't know the answer or the user seems unhappy or disappointed with your response, respond with the specific text in the language of the user: \"I can't find information related to your question. Would you like to create a follow up support ticket? <button create> Create Support Ticket</button create>\". We don't want unhappy users to continue chatting with us.\n 3. If a user requests to talk with AMBOSS support, then answer normally but at the end of your response add, in the language of the user: 'You can also create a support ticket by clicking the button below. <button create> Create Support Ticket</button create>' Don't say customer service, say AMBOSS support.\n 4. Don't say 'If these steps don't resolve the issue, you can reach out to support by', say, in the language of the user: 'You can get into contact with support by clicking the button below <button create> Create Support Ticket</button create>'\n 5. If given a medical term, you can tell the user that you are not a medical expert and are only there to handle customer support, but they can search the AMBOSS platform for the medical term for more information.\n 6. Don't translate the name \"AMBOSS\". AMBOSS must always be directly written as \"AMBOSS\".\n 7. Be concise and straight to the point while providing all the necessary information.\n 8. Be empathetic and understanding of the users issue, without  We are trying to guide the user towards solving their issue. \n \n The Context below is given in the following format:\n - Article title: <article title>\n - Text: <article text>\n \n Context:\n \nArticle title: Refund (money-back guarantee). \nText: 99.8% of our users are fully convinced! We think you will be, too. However, if you’re in the 0.2% that is not 100% satisfied, we will refund you the full amount of your purchase within the first 30 days of purchasing, no questions asked. To request a refund, simply send us your [receipt](https://support.amboss.com/hc/en-us/articles/360060084272) via the widget on the bottom right of this page or our [contact form](https://support.amboss.com/hc/en-us/requests/new). Please note that refunds for purchases made over 30 days ago are not possible and apply only to products purchased directly through AMBOSS and exclude purchases made through [iOS (Apple Store)](https://support.amboss.com/hc/en-us/articles/360037508011).. -- Url: (https://support.amboss.com/hc/en-us/articles/360044238392-Refund-money-back-guarantee) \nArticle title: Canceling a membership. \nText: The basic membership automatically renews on a monthly or yearly basis (depending on your billing option). However, you can cancel it at any time from the first moment after purchasing. Just open the platform and select Account & Settings > Membership & Licenses. Once on that page, select the Cancel Membership button.In case you are paying monthly, your membership will continue until the end of the month. If you cancel a year-long membership, your membership will end 12 months after the latest renewal, and you won’t be charged again. If you wish to cancel your membership immediately, please reach out to our Support team through the chat icon at the bottom right corner of this page. Please note that we have a [30-day refund policy](https://support.amboss.com/hc/en-us/articles/360044238392), so any requests to cancel outside the 30 days will not receive a refund. If you purchased a subscription on our iOS mobile apps, you can cancel directly through your iOS device. This subscription is managed by Apple, and you can find [here](https://support.amboss.com/hc/en-us/articles/360037508011-Canceling-iOS-Subscription) more information on how to cancel it. Please note that if you cancel your membership because you received an AMBOSS access code, you will not be able to redeem the code until after the next renewal date of your membership. Therefore, please wait until your access has expired to redeem the code (you can see the status of your membership in the Account & Settings > Membership & Licenses section of the platform). Alternatively, you can reach out to us via the icon on the bottom right corner of your screen if you'd like to redeem the code immediately, and we'd be happy to look into this. . -- Url: (https://support.amboss.com/hc/en-us/articles/360044237932-Canceling-a-membership) \nArticle title: Title of the article AMBOSS Features & Functions and category Android Mobile Apps. AMBOSS. \nText: AMBOSS in one word: Bäääääääääm!.. -- Url: (https://support.amboss.com/hc/en-us/articles/21952401654417-AMBOSS) \nArticle title: Title of the article AMBOSS Access & Membership and category Purchases & Billing. Payment failure. \nText: If your otherwise valid credit card isn’t being accepted by our shop and you have contacted your bank to make sure they authorize the payment, there are a few troubleshooting checks that you can make to resolve this issue: 1. Are your details being automatically filled in the browser?Sometimes, shop payments fail because the auto-filled text is not recognized. If your contact details are being auto-filled, please try to use an incognito window or an alternative browser without auto-filling, and make sure you manually enter your details. 2. Clear the cache of your web browserIf the issue continues at this point, it's likely the settings of your web browser, which can be corrected by clearing your cache. You can find instructions on how to do this at the following sites, depending on your browser: [Chrome](https://support.google.com/accounts/answer/32050)[Firefox](https://support.mozilla.org/en-US/kb/how-clear-firefox-cache)[Safari](https://support.apple.com/en-gb/guide/safari/sfri11471/13.0/mac/10.15) 3. If the above options are unsuccessful, do you have an alternative payment method?If your card is still not being recognized and your bank is unable to help, try an alternative payment method. We also have PayPal available as a payment method at check-out. If you have a PayPal account, it could be worth trying this option if your bank is unable to help. If you're unsure whether or not your payment has gone through, please check the[ Account & settings > Payment info & invoices](https://next.amboss.com/us/payment-info) section of the platform for your invoice. If the invoice for your purchase appears there, the payment has gone through, and you're all set to study with AMBOSS! You can also verify that you have an active membership by heading to [Account & Settings > Membership & Licenses](https://next.amboss.com/us/access-overview). Additionally, if you're still having any issues after following the steps above, please reach out to us via the help icon on the bottom right of this page, and we'll help you as soon as we can. .. -- Url: (https://support.amboss.com/hc/en-us/articles/360044686971-Payment-failure)";

const fetchOpenAIResponse = async (): Promise<OpenAIResponse[]> => {
  let responses: OpenAIResponse[] = [];

  const systemMessage = getSystemMessagePrompt(3, PROMPT);
  const formattedSystemMessage: OpenAiMessage = {
    role: "system",
    content: systemMessage
  };
  const userMessage: OpenAiMessage = {
    role: "user",
    content:
      "Hi , I cancelled my membership and i want to remove my credit card. How can I remove it ?"
  };
  let formattedMessages = [formattedSystemMessage, userMessage];

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: formattedMessages
    });
    responses.push({
      id: i + 1,
      text: response.choices[0]?.message?.content || ""
    });
  }

  return responses;
};

const saveToJson = async (data: OpenAIResponse[]) => {
  try {
    await writeFile(
      `scripts/results/model_testing-${MODEL}-${(
        Date.now() / 1000
      ).toFixed()}.json`,
      JSON.stringify(data, null, 2)
    );
    console.log("Data has been written to JSON file.");
  } catch (error) {
    console.error("Error saving data to JSON:", error);
  }
};

(async () => {
  try {
    const data = await fetchOpenAIResponse();
    await saveToJson(data);
  } catch (error) {
    console.error("Error fetching OpenAI response or saving to JSON:", error);
  }
})();
