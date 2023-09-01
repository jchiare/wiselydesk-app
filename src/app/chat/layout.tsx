import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WiselyDesk Chat",
  description: "WiselyDesk chat application",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
