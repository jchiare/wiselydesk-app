import ConversationCountChart from "@/components/web/analytics/conversation-chart-count";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

export type FrequencyType = "daily" | "weekly" | "monthly";
export type FilterType = "conversation" | "escalation";

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

export default async function Analytics({
  frequency,
  filter,
  botId
}: {
  frequency: FrequencyType;
  filter: FilterType;
  botId: number;
}) {
  const { conversationCounts } = await fetchConversationCounts(
    botId,
    frequency
  );
  return (
    <ConversationCountChart
      frequency={frequency}
      conversationCounts={conversationCounts}
    />
  );
}
