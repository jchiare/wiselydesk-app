import ChartFrequencySelector from "@/components/web/analytics/chart-frequency-selector";
import ConversationCountChart from "@/components/web/analytics/conversation-chart-count";
import ChartViewingTypeSelector from "@/components/web/analytics/chart-viewing-type-selector";

export type FrequencyType = "daily" | "weekly" | "monthly";
export type ViewingType = "separate" | "stacked";

export default function Analytics({
  frequency,
  viewingType,
  conversationCounts
}: {
  frequency: FrequencyType;
  viewingType: ViewingType;
  conversationCounts: any;
}) {
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <ChartFrequencySelector frequency={frequency} />
        <ChartViewingTypeSelector viewingType={viewingType} />
      </div>
      <ConversationCountChart
        frequency={frequency}
        viewingType={viewingType}
        conversationCounts={conversationCounts}
      />
    </div>
  );
}
