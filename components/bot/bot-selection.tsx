"use client";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type { Bot } from "@prisma/client";
import { URL } from "@/lib/shared/constants";
import { orgChooser } from "@/lib/shared/orgChooser";
import { useRouter } from "next/navigation";
import useCustomQueryString from "@/lib/bot/use-custom-query-string";
import { Session } from "next-auth";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function fetchBots(orgId: number) {
  const res = await fetch(`${URL}/api/organization/${orgId}/bots`, {
    cache: "force-cache"
  });
  const data = await res.json();
  return data.bots;
}

export default function BotSelection({ session }: { session: Session }) {
  const router = useRouter();
  const { changeBotById, getBotId } = useCustomQueryString();

  const [bots, setBots] = useState<Bot[] | undefined>();
  const [selectedBot, setSelectedBot] = useState<Bot | undefined>();
  const [defaultBot, setDefaultBot] = useState<Bot | false>(false);

  useEffect(() => {
    const orgId = orgChooser(session);
    fetchBots(orgId).then((fetchedBots) => {
      setBots(fetchedBots);
      if (!defaultBot && fetchedBots) {
        setDefaultBot(fetchedBots[0]);
      }
    });
  }, [session, defaultBot]);

  useEffect(() => {
    const botId = getBotId();
    if (botId) {
      const foundBot = bots?.find((bot) => bot.id.toString() === botId);
      if (foundBot) {
        setSelectedBot(foundBot);
      }
    }
  }, [bots, getBotId]);

  function changeSelectedBot(bot: Bot) {
    setSelectedBot(bot);
    const newPath = changeBotById(bot.id);
    router.push(newPath);
  }

  return (
    <Listbox value={selectedBot ?? defaultBot} onChange={changeSelectedBot}>
      {({ open }) => (
        <>
          <Listbox.Label className="block pt-6 text-center font-medium leading-6 text-white">
            Choose your bot
          </Listbox.Label>
          <div className="relative mt-2 w-full">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">
                {selectedBot?.name ?? "Choose a bot"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {bots &&
                  bots.map((bot: Bot) => (
                    <Listbox.Option
                      key={bot.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={bot}>
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}>
                            {bot.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}>
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
