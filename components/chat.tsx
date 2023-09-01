import getBotTheme, { joinDefinedClassNames } from "@/lib/botTheme";

export type SearchParams = {
  german_source?: string;
  create_support_ticket?: string;
  client_api_key: string;
  model?: string;
};

type ChatProps = {
  account: string;
  searchParams: SearchParams;
};

export default function Chat({
  account,
  searchParams,
}: ChatProps): JSX.Element | null {
  const {
    german_source: germanSource,
    create_support_ticket: createSupportTicket,
    client_api_key: clientApiKey,
    model,
  } = searchParams;

  const botTheme = getBotTheme(account);
  return (
    <div
      className={`relative flex h-screen flex-col items-center overflow-scroll ${joinDefinedClassNames(
        botTheme.baseSettings,
      )}  flex-shrink-0 font-medium`}
    >
      hey
    </div>
  );
}
