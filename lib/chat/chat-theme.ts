import AmbossChatIcon from "@/public/amboss.png";

type BaseSettings = {
  bgColour: string;
  text?: string;
};

type MessageSetting = {
  bgColour: string;
  border?: string;
  text: string;
  feedbackColour?: string;
  icon?: string | typeof AmbossChatIcon;
};

type SupportTicketSetting = {
  chatButton: string;
  chatButtonCreated: string;
  submitButton: string;
  submitButtonSuccess: string;
};

export type InputSetting = {
  bgColour: string;
  textColour: string;
};

export type ChatThemeSettings = {
  baseSettings: BaseSettings;
  assistantMessageSetting: MessageSetting;
  userMessageSetting: MessageSetting;
  inputSetting: InputSetting;
  default: boolean;
  supportTicketSetting: SupportTicketSetting;
};

const BASE_CHAT_SETTINGS: ChatThemeSettings = {
  baseSettings: {
    bgColour: "bg-[#343541]"
  },
  assistantMessageSetting: {
    bgColour: "bg-[#444654]",
    border: "border-gray-900/50",
    text: "text-gray-100",
    feedbackColour: "text-gray-400"
  },
  userMessageSetting: {
    bgColour: "bg-[#343541]",
    text: "text-gray-100"
  },
  inputSetting: { bgColour: "bg-[#343541]", textColour: "text-black" },
  default: true,
  supportTicketSetting: {
    chatButton: "bg-blue-500 hover:bg-blue-700",
    chatButtonCreated: "bg-green-500",
    submitButton: "bg-blue-500 hover:bg-blue-700",
    submitButtonSuccess: "bg-green-500"
  }
};

const AMBOSS_BOT_SETTINGS: ChatThemeSettings = {
  baseSettings: {
    bgColour: "bg-[#F8FAFC]",
    text: "text-black"
  },
  assistantMessageSetting: {
    bgColour: "bg-[#eef2f5]",
    text: "text-black",
    feedbackColour: "text-black",
    icon: AmbossChatIcon
  },
  userMessageSetting: {
    bgColour: "bg-[#F8FAFC]",
    text: "text-black"
  },
  inputSetting: { bgColour: "bg-[#F8FAFC]", textColour: "text-black" },
  default: false,
  supportTicketSetting: {
    chatButton: "bg-[#0AA7B9] hover:bg-[#099AA4]",
    chatButtonCreated: "bg-[#0ECD9A]",
    submitButton: "bg-[#0AA7B9] hover:bg-[#099AA4]",
    submitButtonSuccess: "bg-[#0ECD9A]"
  }
};

const accountSettings: Record<string, ChatThemeSettings> = {
  amboss: AMBOSS_BOT_SETTINGS,
  3: AMBOSS_BOT_SETTINGS,
  4: AMBOSS_BOT_SETTINGS,
  1: AMBOSS_BOT_SETTINGS
};

export default function getChatTheme(account: string): ChatThemeSettings {
  return accountSettings[account] ?? BASE_CHAT_SETTINGS;
}

export function getChatThemeByBotId(botId: number): ChatThemeSettings {
  return accountSettings[botId] ?? BASE_CHAT_SETTINGS;
}

export const combineClassNames = (settings: Record<string, string | any>) => {
  return Object.values(settings).filter(Boolean).join(" ");
};
