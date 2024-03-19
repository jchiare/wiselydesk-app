import type { Metadata } from "next";
import SessionProvider, { PHProvider } from "@/src/app/(web)/bot/providers";
import SideNav from "@/components/web/side-nav";
import { fetchServerSession } from "@/lib/shared/auth";
import { PostHogPageView } from "@/src/app/(web)/bot/PostHogPageView";
import { orgChooser } from "@/lib/shared/org-chooser";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WiselyDesk App",
  description: "View conversation and settings for your WiselyDesk bots"
};

async function getBots(orgId: number) {
  if (orgId === 2) {
    return prisma.bot.findMany();
  } else {
    return prisma.bot.findMany({
      where: {
        organization_id: orgId
      }
    });
  }
}

export default async function WebLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await fetchServerSession();
  const orgId = orgChooser(session);

  const bots = await getBots(orgId);

  return (
    <SessionProvider session={session}>
      <PHProvider>
        <PostHogPageView />
        <div className="m-0 flex h-screen w-full bg-gray-100 p-0">
          <SideNav session={session} bots={bots} />
          <main className=" w-[calc(100%_-_18rem)] flex-grow overflow-y-scroll">
            {children}
          </main>
        </div>
      </PHProvider>
    </SessionProvider>
  );
}
