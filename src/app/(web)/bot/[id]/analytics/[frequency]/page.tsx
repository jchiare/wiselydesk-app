import { redirect } from "next/navigation";

type ParamsType = {
  params: {
    id: number;
    frequency: string;
    viewingType: string;
  };
};

export default function AnalyticsPageRedirect({ params }: ParamsType) {
  const frequency = params.frequency ?? "daily";
  const viewingType = params.viewingType ?? "separate";
  return redirect(`/bot/${params.id}/analytics/${frequency}/${viewingType}`);
}
