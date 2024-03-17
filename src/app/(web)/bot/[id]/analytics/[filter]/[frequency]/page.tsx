import Analytics, {
  type FilterType,
  type FrequencyType
} from "@/components/web/analytics";
import ChartFrequencySelector from "@/components/web/analytics/chart-frequency-selector";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
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

async function fetchAnalyticsData(
  botId: number,
  frequency: FrequencyType,
  filter: FilterType
) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/analytics/${filter}?frequency=${frequency}`,
    { cache: "no-cache" }
  );
  return (await res.json()) as AnalyticsData;
}

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency, filter } = params;
  const { data } = await fetchAnalyticsData(botId, frequency, filter);

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <ChartFrequencySelector frequency={frequency} />
      </div>
      <Analytics frequency={frequency} data={data} />
    </div>
  );
}
