import Analytics, { type FrequencyType } from "@/components/web/analytics";
import { URL } from "@/lib/shared/constants";

type AnalyticsProps = {
  params: {
    id: number;
    frequency: FrequencyType;
  };
};

async function fetchConversationCounts(
  botId: number,
  frequency: FrequencyType
) {
  const res = await fetch(
    `${URL}/api/analytics/conversation-counts?bot_id=${botId}&frequency=${frequency}`,
    { cache: "no-cache" }
  );
  return await res.json();
}

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency } = params;
  const conversationCounts = await fetchConversationCounts(botId, frequency);
  return (
    <Analytics frequency={frequency} conversationCounts={conversationCounts} />
  );
}
