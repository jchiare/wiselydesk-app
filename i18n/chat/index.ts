export function textByBotId(
  botId: number
): typeof BASE_TEXT | typeof AMBOSS_TEXT {
  if ([1, 3, 4].includes(botId)) {
    return AMBOSS_TEXT;
  }
  return BASE_TEXT;
}

export default function getText(account: string) {
  if (account === "amboss") {
    return AMBOSS_TEXT;
  }
  return BASE_TEXT;
}

const BASE_TEXT = {
  inputPlaceholder: {
    en: "Ask me your questions!",
    de: "Wie kann ich dir helfen?"
  },
  sources: {
    en: "Sources:",
    de: "Quellen:"
  },
  aiWarningExplanation: {
    en: "Answer based on knowledge base content. May not be fully correct as it's AI generated. Consult the sources to be certain.",
    de: "Antworten sind KI-generiert und können Fehler enthalten. Prüfe zur Sicherheit die Quellen oder kontaktiere den AMBOSS-Support persönlich."
  },
  aiWarning: {
    en: "Answer",
    de: "Antwort"
  },
  cancelButton: {
    en: "Cancel Answer",
    de: "Antwort stornieren"
  },
  supportTicketModal: {
    createButton: {
      en: "Create Support Ticket",
      de: "Support-Ticket erstellen"
    },
    createdButton: {
      en: "Support Ticket Created",
      de: "Support-Ticket erstellt"
    },
    submitButton: {
      en: "Submit",
      de: "Einreichen"
    },
    email: {
      en: "Account email address",
      de: "Account email address"
    },
    emailPlaceholder: {
      en: "Enter your account email ...",
      de: "Geben Sie Ihre Konto-E-Mail ein ..."
    },
    info: {
      en: "Additional Info",
      de: "Zusätzliche Informationen"
    },
    additionalInfo: {
      en: "Transcript automatically included. Let us know anything else here",
      de: "Abschrift automatisch enthalten. Lassen Sie uns hier alles Weitere wissen"
    },
    creating: {
      en: "Creating",
      de: "Erstellen"
    },
    success: {
      en: "Success",
      de: "Erfolg"
    }
  }
};

const AMBOSS_TEXT = {
  inputPlaceholder: {
    en: "Ask me your questions!",
    de: "Wie kann ich dir helfen?"
  },
  sources: {
    en: "Sources:",
    de: "Quellen:"
  },
  aiWarningExplanation: {
    en: "Answer based on knowledge base content. May not be fully correct as it's AI generated. Consult the sources to be certain.",
    de: "Antworten sind KI-generiert und können Fehler enthalten. Prüfe zur Sicherheit die Quellen oder kontaktiere den AMBOSS-Support persönlich."
  },
  aiWarning: {
    en: "Answer",
    de: "Antwort"
  },
  cancelButton: {
    en: "Cancel Answer",
    de: "Antwort stornieren"
  },
  supportTicketModal: {
    createButton: {
      en: "Create Support Ticket",
      de: "Support-Ticket erstellen"
    },
    createdButton: {
      en: "Support Ticket Created",
      de: "Support-Ticket erstellt"
    },
    submitButton: {
      en: "Submit",
      de: "Einreichen"
    },
    email: {
      en: "AMBOSS Account Email",
      de: "E-Mail-Adresse (AMBOSS-Account)"
    },
    emailPlaceholder: {
      en: "Enter your AMBOSS account email ...",
      de: "Geben Sie Ihre AMBOSS-Konto-E-Mail ein ..."
    },
    info: {
      en: "Additional Info",
      de: "Zusätzliche Informationen"
    },
    additionalInfo: {
      en: "Transcript automatically included. Let us know anything else here",
      de: "Abschrift automatisch enthalten. Lassen Sie uns hier alles Weitere wissen"
    },
    creating: {
      en: "Creating",
      de: "Erstellen"
    },
    success: {
      en: "Success",
      de: "Erfolg"
    }
  }
};
