import Analytics, {
  type ViewingType,
  type FrequencyType
} from "@/components/web/analytics";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

type AnalyticsProps = {
  params: {
    id: number;
    frequency: FrequencyType;
    viewingType: ViewingType;
  };
};

async function fetchConversationCounts(
  botId: number,
  frequency: FrequencyType,
  viewingType: ViewingType
) {
  const res = await fetch(
    `${NEXTJS_BACKEND_URL}/api/bot/${botId}/analytics/conversation-counts?frequency=${frequency}&viewingType=${viewingType}`,
    { cache: "no-cache" }
  );
  return await res.json();
}

export default async function AnalyticsFrequencyPage({
  params
}: AnalyticsProps) {
  const { id: botId, frequency, viewingType } = params;
  const { conversationCounts } = await fetchConversationCounts(
    botId,
    frequency,
    viewingType
  );
  return (
    <Analytics
      frequency={frequency}
      viewingType={viewingType}
      conversationCounts={conversationCounts}
    />
  );
}
