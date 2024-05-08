const AMBOSS_WELCOME_REPLY = {
  en: "Hi there and welcome to AMBOSS! \nI'm a virtual assistant and happy to help you with your request.",
  de: "Hallo und herzlich Willkommen bei AMBOSS! \nIch bin ein virtueller Assistent und stehe dir bei Fragen gerne zur Verfügung!"
};

const DEFAULT_WELCOME_REPLY = {
  en: "Ask any question about the content below! Like 'refund policy' or 'where do you ship to?"
};
export function welcomeReply(account: string, locale: string = "en"): string {
  if (account === "amboss") {
    const welcomeReply =
      AMBOSS_WELCOME_REPLY[locale as keyof typeof AMBOSS_WELCOME_REPLY];
    if (!welcomeReply) {
      throw Error(
        `Unknown locale provided to welcome reply. Locale: ${locale}`
      );
    }
    return welcomeReply;
  }
  return DEFAULT_WELCOME_REPLY[locale as keyof typeof DEFAULT_WELCOME_REPLY];
}
