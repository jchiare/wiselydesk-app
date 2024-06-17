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
  const botLookup: Record<string, number> = {
    qGmNXgVcRRwVpL6i2bIDDYvPc8lJcSvndKE7DUZzq5M: 1,
    "2JcUUnHpgW5PAObuSmSGCsCRgW3Hhqg5yiznEZnAzzY": 3,
    hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE: 4
  };
  let botId = botLookup[params.clientApiKey];
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
