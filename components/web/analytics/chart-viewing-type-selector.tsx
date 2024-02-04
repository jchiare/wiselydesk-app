"use client";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type { ViewingType } from "@/components/web/analytics";
import { useRouter } from "next/navigation";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ChartViewingTypeSelector({
  viewingType
}: {
  viewingType: ViewingType;
}) {
  const router = useRouter();
  const { pathname } = useCustomQueryString();
  const changeViewingType = (newViewingType: ViewingType) => {
    const segments = pathname.split("/");
    const analyticsIndex = segments.indexOf("analytics");

    if (analyticsIndex !== -1) {
      segments[analyticsIndex + 2] = newViewingType;
      const newPath = segments.join("/");
      router.push(newPath);
    }
  };

  return (
    <Listbox value={viewingType} onChange={changeViewingType}>
      {({ open }) => (
        <>
          <div className="mt-2">
            <Listbox.Button className="relative cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{viewingType}</span>
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
              <Listbox.Options className="absolute z-10 mt-2 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {["separate", "stacked"].map((viewingType) => (
                  <Listbox.Option
                    key={viewingType}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={viewingType}>
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}>
                          {viewingType}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
