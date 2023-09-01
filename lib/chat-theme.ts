type BaseSettings = {
  bgColour: string;
  text?: string;
};

type MessageSetting = {
  bgColour: string;
  border?: string;
  text: string;
  feedbackColour?: string;
  icon?: string;
};

type InputSetting = {
  bgColour: string;
  textColour: string;
};

export type ChatThemeSettings = {
  baseSettings: BaseSettings;
  assistantMessageSetting: MessageSetting;
  userMessageSetting: MessageSetting;
  inputSetting: InputSetting;
  default: boolean;
};

const BASE_CHAT_SETTINGS: ChatThemeSettings = {
  baseSettings: {
    bgColour: "bg-[#343541]",
  },
  assistantMessageSetting: {
    bgColour: "bg-[#444654]",
    border: "border-gray-900/50",
    text: "text-gray-100",
    feedbackColour: "text-gray-400",
  },
  userMessageSetting: {
    bgColour: "bg-[#343541]",
    text: "text-gray-100",
  },
  inputSetting: { bgColour: "bg-[#343541]", textColour: "text-black" },
  default: true,
};

const AMBOSS_BOT_SETTINGS: ChatThemeSettings = {
  baseSettings: {
    bgColour: "bg-[#F8FAFC]",
    text: "text-black",
  },
  assistantMessageSetting: {
    bgColour: "bg-[#a3d8e7ff]",
    text: "text-black",
    feedbackColour: "text-black",
    icon: "/amboss.png",
  },
  userMessageSetting: {
    bgColour: "bg-[#F8FAFC]",
    text: "text-black",
  },
  inputSetting: { bgColour: "bg-[#F8FAFC]", textColour: "text-black" },
  default: false,
};

const accountSettings: Record<string, ChatThemeSettings> = {
  amboss: AMBOSS_BOT_SETTINGS,
};

export default function getChatTheme(account: string): ChatThemeSettings {
  return accountSettings[account] ?? BASE_CHAT_SETTINGS;
}

export const combineClassNames = (
  settings: Record<string, string | undefined>,
) => {
  return Object.values(settings).filter(Boolean).join(" ");
};
