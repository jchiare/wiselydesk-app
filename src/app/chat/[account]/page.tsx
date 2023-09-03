import Chat, { type SearchParams } from "@/components/chat";
import getChatTheme from "@/lib/chat/chat-theme";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

export default function Page({ params, searchParams }: ChatPageProps) {
  const chatTheme = getChatTheme(params.account);
  return (
    <main>
      <Chat
        chatTheme={chatTheme}
        searchParams={searchParams}
        account={params.account}
      />
    </main>
  );
}
