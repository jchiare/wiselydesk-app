import Analytics, {
  type FilterType,
  type FrequencyType
} from "@/components/web/analytics";
import ChartFrequencySelector from "@/components/web/analytics/chart-frequency-selector";

type AnalyticsProps = {
  params: {
    id: number;
    frequency: FrequencyType;
  };
  searchParams: {
    filter: FilterType;
  };
};

export default async function AnalyticsFrequencyPage({
  params,
  searchParams
}: AnalyticsProps) {
  const { id: botId, frequency } = params;
  const { filter } = searchParams;

  if (!filter) {
    return <div>Filter is required</div>;
  }

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <ChartFrequencySelector frequency={frequency} />
      </div>
      <Analytics frequency={frequency} filter={filter} botId={botId} />
    </div>
  );
}
