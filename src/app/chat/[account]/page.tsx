import Chat, { type SearchParams } from "@/components/chat";
import getChatTheme from "@/lib/chat/chat-theme";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import type { Bot } from "@prisma/client";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

async function getBot(clientApiKey: string) {
  const response = await fetch(`${NEXTJS_BACKEND_URL}/api/bot/find`, {
    method: "POST",
    body: JSON.stringify({ clientApiKey })
  });
  const bot = await response.json();
  return bot.bot as Bot;
}

export default async function Page({ params, searchParams }: ChatPageProps) {
  const bot = await getBot(searchParams.client_api_key);
  const chatTheme = getChatTheme(params.account);
  if (!bot) {
    return <div>Bot not found</div>;
  }
  return (
    <main>
      <Chat
        chatTheme={chatTheme}
        searchParams={searchParams}
        account={params.account}
        bot={bot}
      />
    </main>
  );
}
