import Chat, { type SearchParams } from "@/components/chat";
import getChatTheme from "@/lib/chat/chat-theme";
import prisma from "@/lib/prisma";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

export default async function Page({ params, searchParams }: ChatPageProps) {
  const bot = await prisma.bot.findFirst({
    where: { client_api_key: searchParams.client_api_key }
  });
  if (!bot) {
    return <div>Bot not found</div>;
  }

  const chatTheme = getChatTheme(params.account);

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
