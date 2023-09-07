import type { Metadata } from "next";
import SessionProvider from "@/src/app/bot/providers";
import SideNav from "@/components/web/side-nav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "WiselyDesk App",
  description: "View conversation and settings for your WiselyDesk bots"
};

export default async function WebLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) return redirect("/auth/signin");

  return (
    <SessionProvider session={session}>
      <div className="m-0 flex h-screen w-full bg-gray-100 p-0">
        <SideNav session={session} />
        <main className=" w-[calc(100%_-_18rem)] flex-grow overflow-y-scroll">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
