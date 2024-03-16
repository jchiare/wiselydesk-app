import { redirect } from "next/navigation";

type ParamsType = {
  params: {
    id: number;
    frequency: string;
  };
  searchParams: {
    filter: string;
  };
};

export default function AnalyticsPageRedirect({
  params,
  searchParams
}: ParamsType) {
  const frequency = params.frequency ?? "daily";
  return redirect(
    `/bot/${params.id}/analytics/${frequency}?filter=${searchParams.filter}`
  );
}
