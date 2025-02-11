import ConversationCountChart from "@/components/web/analytics/conversation-chart";
import EscalationChart from "@/components/web/analytics/escalation-chart";
import { NEXTJS_BACKEND_URL } from "@/lib/constants";
import type { AnalyticsData } from "@/src/app/(non-widget)/(web)/bot/[id]/analytics/[filter]/[frequency]/page";

export type FrequencyType = "daily" | "weekly" | "monthly";
export type FilterType = "conversations" | "escalations";

async function fetchAnalyticsData(
  botId: number,
  frequency: FrequencyType,
  filter: FilterType
) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/analytics/${filter}?frequency=${frequency}`,
    { cache: "no-cache" }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics data: ${res.statusText}`);
  }
  return (await res.json()) as AnalyticsData;
}

export default async function Analytics({
  frequency,
  botId,
  filter
}: {
  frequency: FrequencyType;
  botId: number;
  filter: FilterType;
}) {
  try {
    const { data } = await fetchAnalyticsData(botId, frequency, filter);
    if (data.escalations) {
      return (
        <EscalationChart frequency={frequency} escalations={data.escalations} />
      );
    } else if (data.conversations) {
      return (
        <ConversationCountChart
          frequency={frequency}
          conversationCounts={data.conversations}
        />
      );
    }
    return <div>Error: Data format is incorrect.</div>;
  } catch (error: any) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }
}
