import Analytics, {
  type ViewingType,
  type FrequencyType
} from "@/components/web/analytics";
import { URL } from "@/lib/shared/constants";

type AnalyticsProps = {
  params: {
    id: number;
    frequency: FrequencyType;
    viewingType: ViewingType;
  };
};

async function fetchConversationCounts(
  botId: number,
  frequency: FrequencyType
) {
  const res = await fetch(
    `${URL}/api/analytics/conversation-counts?bot_id=${botId}&frequency=${frequency}`,
    { cache: "no-cache" }
  );
  return await res.json();
}

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency, viewingType } = params;
  const conversationCounts = await fetchConversationCounts(botId, frequency);
  return (
    <Analytics
      frequency={frequency}
      viewingType={viewingType}
      conversationCounts={conversationCounts}
    />
  );
}
