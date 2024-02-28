import { redirect } from "next/navigation";

type ParamsType = {
  params: {
    id: number;
    frequency: string;
  };
};

export default function AnalyticsPageRedirect({ params }: ParamsType) {
  const frequency = params.frequency ?? "daily";
  return redirect(`/bot/${params.id}/analytics/${frequency}`);
}
