"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import { cn } from "@/lib/utils";

export type FrequencyType = "daily" | "weekly" | "monthly";

const FREQUENCY_OPTIONS: FrequencyType[] = ["daily", "weekly", "monthly"];

type ChartFrequencySelectorProps = {
  frequency: FrequencyType;
  isLoading?: boolean;
};

export default function ChartFrequencySelector({
  frequency,
  isLoading
}: ChartFrequencySelectorProps) {
  const router = useRouter();
  const { pathname } = useCustomQueryString();

  const changeFrequency = (newFrequency: FrequencyType) => {
    const segments = pathname.split("/");
    const analyticsIndex = segments.indexOf("analytics");

    if (analyticsIndex !== -1) {
      segments[analyticsIndex + 2] = newFrequency;
      const newPath = segments.join("/");
      router.push(newPath);
    }
  };

  return (
    <Listbox value={frequency} onChange={changeFrequency} disabled={isLoading}>
      {({ open }) => (
        <div className="relative mt-2">
          <Listbox.Button
            className={cn(
              "relative w-[110px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
              "hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "sm:text-sm sm:leading-6"
            )}
            aria-label="Select frequency">
            <span className={isLoading ? "blur-sm" : ""}>
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
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
            <Listbox.Options
              className={cn(
                "absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1",
                "text-base shadow-lg ring-1 ring-black ring-opacity-5",
                "focus:outline-none sm:text-sm"
              )}>
              {FREQUENCY_OPTIONS.map(option => (
                <Listbox.Option
                  key={option}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }
                  value={option}>
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-semibold" : "font-normal"
                        )}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </span>

                      {selected && (
                        <span
                          className={cn(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
