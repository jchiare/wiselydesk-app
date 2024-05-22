import { Widget } from "@/components/widget";
import prisma from "@/lib/prisma";
import getChatTheme from "@/lib/chat/chat-theme";
import type { Metadata } from "next";
import type { SearchParams } from "@/components/chat";

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
  const bot = await prisma.bot.findFirst({
    where: { client_api_key: searchParams.client_api_key }
  });
  if (!bot) {
    return <div>Bot not found</div>;
  }

  const chatTheme = getChatTheme("amboss");

  return (
    <Widget
      bot={bot}
      clientApiKey={params.clientApiKey}
      searchParams={searchParams}
      chatTheme={chatTheme}
    />
  );
}
