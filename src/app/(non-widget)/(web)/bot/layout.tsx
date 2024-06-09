import type { Metadata } from "next";
import SideNav from "@/components/web/side-nav";
import { fetchServerSession } from "@/lib/shared/auth";
import { orgChooser } from "@/lib/shared/org-chooser";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

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

async function findExistingActivity(userId: number, orgId: number) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  return prisma.activity.findMany({
    where: {
      userId: userId,
      orgId: orgId,
      action: "web_layout",
      createdAt: {
        gte: fifteenMinutesAgo
      }
    }
  });
}

const getCachedExistingActivity = unstable_cache(
  findExistingActivity,
  ["activity_check"],
  { revalidate: 900 }
);

async function setActivity(userId: number, orgId: number) {
  if (userId === 10) {
    console.log("Skipping WiselyDesk user");
    return;
  }

  const existingActivities = await getCachedExistingActivity(userId, orgId);
  if (existingActivities.length === 0) {
    await prisma.activity.create({
      data: {
        userId: userId,
        orgId: orgId,
        action: "web_layout"
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

  // await setActivity(session.user.internal_user_id, orgId);

  return (
    <div className="m-0 flex h-screen w-full bg-gray-100 p-0">
      <SideNav session={session} bots={bots} />
      <main className=" w-[calc(100%_-_18rem)] flex-grow overflow-y-scroll">
        {children}
      </main>
    </div>
  );
}
