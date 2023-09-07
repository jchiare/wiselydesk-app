import Image from "next/image";
import BotSelection from "@/components/web/bot-selection";

import { Session } from "next-auth";
import Navigation from "@/components/web/navigation";

export default async function SideNav({
  session
}: {
  session: Session;
}): Promise<JSX.Element> {
  return (
    <div className="flex w-64 grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-800 px-6">
      <div className="flex h-16 flex-col items-center">
        <BotSelection session={session} />
      </div>
      <div className="mt-[20px] flex" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <Navigation />
          </li>
          <li className="-mx-6 mt-auto">
            <hr className="border text-gray-400" />
            <div className="flex items-center justify-center gap-x-4 py-3 pr-6 text-sm font-semibold leading-6 text-gray-400 hover:cursor-pointer hover:bg-gray-600">
              <div className="flex items-center">
                <div>
                  <span className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={
                        session?.user?.image ?? "/profile_picture_backup.png"
                      }
                      alt="Profile Picture"
                      width={40}
                      height={40}
                    />
                  </span>
                </div>
                <div className="ml-3">
                  {session && session.user && (
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-600">
                      {session.user.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
