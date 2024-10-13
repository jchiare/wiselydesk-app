"use client";
import BotSelection from "@/components/web/bot-selection";
import { Session } from "next-auth";
import { UserProfile } from "@/components/web/user-profile";
import Navigation from "@/components/web/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/lib/utils";
import Link from "next/link";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

import { type Bot } from "@prisma/client";
import { useState } from "react";

function getUserInitials(name: string) {
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("");
  return initials;
}

function SettingsNavigation() {
  const { getBotId, pathname } = useCustomQueryString();
  const botId = getBotId();

  const settingsItem = {
    name: "Settings",
    icon: Cog6ToothIcon,
    href: `/bot/${botId}/settings`
  };

  const isActive = pathname.includes(settingsItem.href);

  return (
    <div className="mt-6">
      <div className="mb-4 border-t-2 border-gray-700" />
      <div className="mt-1">
        <Link
          href={settingsItem.href}
          className={concatClassNames(
            isActive ? "bg-gray-700" : "hover:bg-gray-700",
            "flex w-full items-center justify-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-400 sm:justify-normal"
          )}>
          <settingsItem.icon
            className="h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
            aria-hidden="true"
          />
          {settingsItem.name}
        </Link>
      </div>
    </div>
  );
}

export default function SideNav({
  session,
  bots
}: {
  session: Session;
  bots: Bot[];
}): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex w-full gap-y-5 border-r border-gray-200 bg-gray-800 sm:w-56 sm:flex-col sm:px-6">
        <BotSelection bots={bots} />
        <div
          aria-hidden="true"
          className="my-5 hidden w-full border-t border-gray-300 sm:flex"
        />
        <button
          className="flex w-[60%] justify-center p-4 text-gray-500 sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}>
          {isMobileMenuOpen ? (
            <XMarkIcon className={`sh-6 w-6`} />
          ) : (
            <Bars3Icon className={`sh-6 w-6`} />
          )}
          <span className="ml-2 font-medium text-white">
            {isMobileMenuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>
      <div
        className={`${
          isMobileMenuOpen ? "flex sm:hidden" : "hidden sm:flex"
        } w-full flex-col justify-between gap-y-5 border-r border-gray-200 bg-gray-800 sm:w-56 sm:flex-1 sm:px-6`}>
        <div className="space-y-10">
          <Navigation />
          <SettingsNavigation />
        </div>
        <div className="hidden sm:block">
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
        </div>
      </div>
    </div>
  );
}
