import ConversationCountChart from "@/components/web/analytics/conversation-chart";
import EscalationChart from "@/components/web/analytics/escalation-chart";
import type { AnalyticsData } from "@/src/app/(web)/bot/[id]/analytics/[filter]/[frequency]/page";

export type FrequencyType = "daily" | "weekly" | "monthly";
export type FilterType = "conversations" | "escalations";

export default async function Analytics({
  frequency,
  data
}: {
  frequency: FrequencyType;
  data: AnalyticsData["data"];
}) {
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
  return <div> Error data not correct</div>;
}
