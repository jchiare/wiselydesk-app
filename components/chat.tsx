import getChatTheme, { combineClassNames } from "@/lib/chat-theme";
import AgentMessage from "@/components/agent/agent-message";

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
}: ChatProps): JSX.Element {
  const {
    german_source: germanSource,
    create_support_ticket: createSupportTicket,
    client_api_key: clientApiKey,
    model,
  } = searchParams;

  const chatTheme = getChatTheme(account);
  return (
    <div
      className={`relative flex h-screen flex-col items-center overflow-scroll ${combineClassNames(
        chatTheme.baseSettings,
      )}  flex-shrink-0 font-medium`}
    >
      <AgentMessage chatTheme={chatTheme} />
    </div>
  );
}
