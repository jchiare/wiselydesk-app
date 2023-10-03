import { Widget } from "@/components/widget";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WiselyDesk Widget",
  description: "WiselyDesk widget"
};

export default function ChatbotWidget({}: {}): JSX.Element {
  return (
    <div className="fixed bottom-5 right-5 z-50 h-12 w-12 origin-center select-none  transition-transform duration-200 ease-in">
      <div className="absolute left-0 top-0 h-12 w-12 cursor-pointer overflow-hidden rounded-full antialiased">
        <Widget />
      </div>
    </div>
  );
}
