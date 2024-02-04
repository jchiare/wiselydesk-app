import ChartFrequencySelector from "@/components/web/analytics/chart-frequency-selector";
import ConversationCountChart from "@/components/web/analytics/conversation-chart-count";

export type FrequencyType = "daily" | "weekly" | "monthly";

export default function Analytics({
  frequency,
  conversationCounts
}: {
  frequency: FrequencyType;
  conversationCounts: any;
}) {
  return (
    <div className="mt-2">
      <ChartFrequencySelector frequency={frequency} />
      <ConversationCountChart
        frequency={frequency}
        conversationCounts={conversationCounts}
      />
    </div>
  );
}
