"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure, Transition } from "@headlessui/react";
import { concatClassNames } from "@/lib/shared/utils";
import type { NavigationItem } from "@/components/web/navigation";

export default function SideNavDisclosure({
  item,
  currentItem
}: {
  item: NavigationItem;
  currentItem: NavigationItem;
}): JSX.Element {
  const isChildSelected = item.children?.some(
    (child: NavigationItem) => child.href === currentItem?.href
  );

  return (
    <Disclosure as="div" defaultOpen={isChildSelected} key={currentItem?.href}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={concatClassNames(
              item.href === currentItem?.href
                ? "bg-gray-700"
                : "hover:bg-gray-700",
              "flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-400"
            )}>
            <item.icon
              className="h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">{item.name}</span>
            <ChevronRightIcon
              className={concatClassNames(
                open ? "rotate-90 text-gray-500" : "text-gray-400",
                "ml-auto h-5 w-5 shrink-0"
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
            <Disclosure.Panel as="ul" unmount={false} className="flex flex-col">
              {item.children?.map((subItem: NavigationItem) => (
                <li key={subItem.name}>
                  {/* 44px */}
                  <Disclosure.Button
                    as="a"
                    href={subItem.href}
                    className={concatClassNames(
                      subItem.href === currentItem?.href
                        ? "bg-gray-700"
                        : "hover:bg-gray-700",
                      "flex justify-center rounded-md p-1 text-sm leading-6 text-gray-400 sm:justify-start sm:pl-3"
                    )}>
                    <span className="hidden sm:inline">{subItem.name}</span>
                    <span className="inline text-center sm:hidden">
                      {subItem.name.charAt(0).toUpperCase()}
                    </span>
                  </Disclosure.Button>
                </li>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
