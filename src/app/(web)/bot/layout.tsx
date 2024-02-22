import type { Metadata } from "next";
import SessionProvider, { PHProvider } from "@/src/app/(web)/bot/providers";
import SideNav from "@/components/web/side-nav";
import { fetchServerSession } from "@/lib/shared/auth";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "WiselyDesk App",
  description: "View conversation and settings for your WiselyDesk bots"
};

export default async function WebLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await fetchServerSession();

  return (
    <SessionProvider session={session}>
      <PHProvider>
        <div className="m-0 flex h-screen w-full bg-gray-100 p-0">
          <SideNav session={session} />
          <main className=" w-[calc(100%_-_18rem)] flex-grow overflow-y-scroll">
            {children}
          </main>
        </div>
      </PHProvider>
    </SessionProvider>
  );
}
