import type { FilterType } from "@/components/web/analytics";
import { redirect } from "next/navigation";

type ParamsType = {
  params: {
    id: number;
    frequency: string;
    filter: FilterType;
  };
};

export default function AnalyticsPageRedirect({ params }: ParamsType) {
  const frequency = params.frequency ?? "daily";
  const defaultFilter = params.filter ?? "conversations";
  return redirect(`/bot/${params.id}/analytics/${defaultFilter}/${frequency}`);
}
