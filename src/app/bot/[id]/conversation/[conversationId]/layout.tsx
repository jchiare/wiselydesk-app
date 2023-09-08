import type { Metadata } from "next/types";
import BackButton from "@/components/web/back-button";

export const metadata: Metadata = {
  title: "Single Conversation | WiselyDesk",
  description: "View a single conversation in WiselyDesk"
};

export default async function SingleConversationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="h-full">
        <BackButton />
        {children}
      </div>
    </div>
  );
}
