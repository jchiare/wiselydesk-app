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
    <div className="-mx-4 mt-8 sm:-mx-0">
      <ChartFrequencySelector frequency={frequency} />
      <br />
      <ConversationCountChart
        frequency={frequency}
        conversationCounts={conversationCounts}
      />
    </div>
  );
}
