import Chat, { type SearchParams } from "@/components/chat";
import getChatTheme, { combineClassNames } from "@/lib/chat-theme";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

export default function Page({ params, searchParams }: ChatPageProps) {
  const chatTheme = getChatTheme(params.account);
  return (
    <main
      className={`relative flex h-screen w-full flex-col items-center overflow-scroll antialiased ${combineClassNames(
        chatTheme.baseSettings
      )} flex-shrink-0 font-medium`}>
      <Chat
        chatTheme={chatTheme}
        searchParams={searchParams}
        account={params.account}
      />
    </main>
  );
}
