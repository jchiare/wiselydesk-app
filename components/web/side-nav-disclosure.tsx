"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure, Transition } from "@headlessui/react";
import { concatClassNames } from "@/lib/utils";
import type { NavigationItem } from "@/components/web/navigation";
import Link from "next/link";
import React from "react";

type SideNavDisclosureProps = {
  item: NavigationItem;
  currentItem: NavigationItem;
};

export default function SideNavDisclosure({
  item,
  currentItem
}: SideNavDisclosureProps): JSX.Element {
  const isChildSelected = item.children?.some(
    (child: NavigationItem) => child.href === currentItem?.href
  );

  return (
    <Disclosure
      as="div"
      className="w-full"
      defaultOpen={isChildSelected}
      key={currentItem?.href}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={concatClassNames(
              item.href === currentItem?.href
                ? "bg-gray-700"
                : "hover:bg-gray-700",
              "flex w-full items-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 transition-colors sm:justify-normal"
            )}
            aria-expanded={open}
            aria-controls={`${item.name}-panel`}>
            <item.icon
              className="h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            {item.name}
            <ChevronRightIcon
              className={concatClassNames(
                open ? "rotate-90 text-gray-500" : "text-gray-400",
                "h-5 w-5 shrink-0 transition-transform duration-200 sm:ml-auto"
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Disclosure.Panel
              id={`${item.name}-panel`}
              as="div"
              unmount={false}
              className="mt-1 flex flex-col space-y-1 pl-2">
              {item.children?.map((subItem: NavigationItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href!}
                  className={concatClassNames(
                    subItem.href === currentItem?.href
                      ? "bg-gray-700"
                      : "hover:bg-gray-700",
                    "flex items-center rounded-md p-2 text-sm leading-6 text-gray-400 transition-colors"
                  )}
                  aria-current={
                    subItem.href === currentItem?.href ? "page" : undefined
                  }>
                  <subItem.icon
                    className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {subItem.name}
                </Link>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
