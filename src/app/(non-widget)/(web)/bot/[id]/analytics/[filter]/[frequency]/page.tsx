import Analytics, {
  type FilterType,
  type FrequencyType
} from "@/components/web/analytics";
import ChartFrequencySelector from "@/components/web/analytics/chart-frequency-selector";

import type {
  ConversationAnalyticsData,
  EscalationAnalyticsData
} from "@/lib/web/analytics";

type AnalyticsProps = {
  params: {
    id: number;
    frequency: FrequencyType;
    filter: FilterType;
  };
};

export type AnalyticsData = {
  data: {
    escalations?: EscalationAnalyticsData[];
    conversations?: ConversationAnalyticsData[];
  };
};

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency, filter } = params;

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <ChartFrequencySelector frequency={frequency} />
      </div>
      <Analytics frequency={frequency} botId={botId} filter={filter} />
    </div>
  );
}
