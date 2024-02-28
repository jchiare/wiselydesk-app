import Analytics, { type FrequencyType } from "@/components/web/analytics";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

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
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/analytics/conversation-counts?frequency=${frequency}`,
    { cache: "no-cache" }
  );
  return await res.json();
}

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency } = params;
  const { conversationCounts } = await fetchConversationCounts(
    botId,
    frequency
  );
  return (
    <Analytics frequency={frequency} conversationCounts={conversationCounts} />
  );
}
