import { Widget } from "@/components/widget";
import type { Metadata } from "next";
import type { SearchParams } from "@/components/chat";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WiselyDesk Widget",
  description: "WiselyDesk widget"
};

type Params = {
  clientApiKey: string;
};

export default function ChatbotWidget({
  params,
  searchParams
}: {
  searchParams: SearchParams;
  params: Params;
}): JSX.Element {
  return (
    <Widget clientApiKey={params.clientApiKey} searchParams={searchParams} />
  );
}
