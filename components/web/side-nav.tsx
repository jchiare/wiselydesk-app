import BotSelection from "@/components/web/bot-selection";
import { Session } from "next-auth";
import { UserProfile } from "@/components/web/user-profile";
import Navigation from "@/components/web/navigation";

import { type Bot } from "@prisma/client";

function getUserInitials(name: string) {
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("");
  return initials;
}

export default async function SideNav({
  session,
  bots
}: {
  session: Session;
  bots: Bot[];
}): Promise<JSX.Element> {
  return (
    <div className="flex w-10 flex-col gap-y-5 border-r border-gray-200 bg-gray-800 sm:w-56 sm:px-6">
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
          <div className="mx-auto flex items-center justify-center gap-x-2 py-3 text-sm font-semibold leading-6 text-gray-400">
            <span className="hidden h-6 w-6 overflow-hidden rounded-full bg-gray-100 sm:inline-block">
              <UserProfile imageUrl={session?.user?.image} />
            </span>
            {session?.user?.name && (
              <p className="mr-2 text-sm font-medium text-gray-500 group-hover:text-gray-600">
                <span className="hidden sm:inline">{session.user.name}</span>
                <span className="sm:hidden">
                  {getUserInitials(session.user.name)}
                </span>
              </p>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
