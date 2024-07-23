import { Widget } from "@/components/widget";
import getChatTheme from "@/lib/chat/chat-theme";
import type { Metadata } from "next";
import type { SearchParams } from "@/components/widget/chat";
import { BOT_ID_MAPPING } from "@/lib/chat/conversation/parse-payload";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WiselyDesk Widget",
  description: "WiselyDesk widget"
};

type Params = {
  clientApiKey: string;
  widgetOpen: string;
};

export default async function ChatbotWidget({
  params,
  searchParams
}: {
  searchParams: SearchParams;
  params: Params;
}): Promise<JSX.Element> {
  let botId = BOT_ID_MAPPING[params.clientApiKey];
  if (!botId) {
    throw new Error("something wrong with botid");
  }

  const chatTheme = getChatTheme("amboss");

  return (
    <Widget
      botId={botId}
      clientApiKey={params.clientApiKey}
      searchParams={searchParams}
      chatTheme={chatTheme}
    />
  );
}
