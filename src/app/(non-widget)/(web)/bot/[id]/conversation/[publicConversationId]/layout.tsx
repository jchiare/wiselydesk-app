import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Single Conversation | WiselyDesk",
  description: "View a single conversation in WiselyDesk"
};

export default async function WebConversationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="h-full">{children}</div>
    </div>
  );
}
