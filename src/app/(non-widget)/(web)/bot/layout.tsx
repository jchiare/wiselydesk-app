import type { Metadata } from "next";
import SideNav from "@/components/web/side-nav";
import { fetchServerSession } from "@/lib/auth";
import { orgChooser } from "@/lib/org-chooser";
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
    <div className="flex h-screen w-full flex-col bg-gray-100 sm:flex-row">
      <SideNav session={session} bots={bots} />
      <main className="w-full flex-1 overflow-y-scroll sm:w-auto">
        {children}
      </main>
    </div>
  );
}
