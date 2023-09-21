import Chat, { type SearchParams } from "@/components/chat";
import getChatTheme from "@/lib/chat/chat-theme";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

export default async function Page({ params, searchParams }: ChatPageProps) {
  const bot = await fetch(`${NEXTJS_BACKEND_URL}/api/bot/find`, {
    method: "POST",
    cache: "no-cache"
  });

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
