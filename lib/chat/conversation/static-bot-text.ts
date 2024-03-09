type WelcomeMessageResponse = {
  welcome_message: string;
  ai_answer_help_text: {
    text: string;
    explanation: string;
  };
  input_placeholder?: string;
};

export function getStaticBotText(botId: number): WelcomeMessageResponse {
  let response: WelcomeMessageResponse = {
    welcome_message:
      "Ask any question about the content below! Like 'refund policy' or 'where do you ship to?'",
    ai_answer_help_text: {
      text: "Answer",
      explanation:
        "Answer based on knowledge base content. May not be fully correct as it's AI generated. Consult the sources to be certain."
    }
  };

  switch (botId) {
    case 3:
      response = {
        ...response,
        welcome_message:
          "Hi there and welcome to AMBOSS! I'm a virtual assistant and happy to help you with your request."
      };
      break;
    case 4:
      response = {
        ...response,
        welcome_message:
          "Hallo und herzlich Willkommen bei AMBOSS! Ich bin ein virtueller Assistent und stehe dir bei Fragen gerne zur Verfügung!",
        input_placeholder: "Wie kann ich dir helfen?",
        ai_answer_help_text: {
          text: "Antwort",
          explanation:
            "Antworten sind KI-generiert und können Fehler enthalten. Prüfe zur Sicherheit die Quellen oder kontaktiere den AMBOSS-Support persönlich."
        }
      };
      break;
  }

  return response;
}
