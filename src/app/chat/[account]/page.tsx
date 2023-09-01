import Chat, { type SearchParams } from "@/components/chat";

type ChatPageProps = {
  params: {
    account: string;
  };
  searchParams: SearchParams;
};

export default function Page({ params, searchParams }: ChatPageProps) {
  return (
    <main className="h-full w-full antialiased">
      <Chat account={params.account} searchParams={searchParams} />
    </main>
  );
}
