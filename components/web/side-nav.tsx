import BotSelection from "@/components/web/bot-selection";
import { Session } from "next-auth";
import { UserProfile } from "@/components/web/user-profile";
import Navigation from "@/components/web/navigation";

import { type Bot } from "@prisma/client";

export default async function SideNav({
  session,
  bots
}: {
  session: Session;
  bots: Bot[];
}): Promise<JSX.Element> {
  return (
    <div className="flex w-4 flex-col gap-y-5 border-r border-gray-200 bg-gray-800 px-6 sm:w-56">
      <BotSelection bots={bots} />
      <div
        aria-hidden="true"
        className="mt-[20px] flex w-full border-t border-gray-300"
      />

      <ul role="list" className="flex flex-1 flex-col justify-between">
        <li>
          <Navigation />
        </li>
        <li>
          <hr className="-mx-6 border text-gray-400" />
          <div className="flex items-center justify-center py-3 pr-6 text-sm font-semibold leading-6 text-gray-400">
            <span className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100">
              <UserProfile imageUrl={session?.user?.image} />
            </span>
            {session?.user?.name && (
              <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-600">
                {session.user.name}
              </p>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
