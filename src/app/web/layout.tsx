import type { Metadata } from "next";
import Providers from "@/src/app/web/providers";

export const metadata: Metadata = {
  title: "WiselyDesk App",
  description: "View conversation and settings for your WiselyDesk bots"
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
