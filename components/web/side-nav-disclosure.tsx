"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure, Transition } from "@headlessui/react";
import { concatClassNames } from "@/lib/utils";
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
    <Disclosure
      as="div"
      className="w-full justify-center"
      defaultOpen={isChildSelected}
      key={currentItem?.href}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={concatClassNames(
              item.href === currentItem?.href
                ? "bg-gray-700"
                : "hover:bg-gray-700",
              "flex w-full items-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 sm:justify-normal"
            )}>
            <item.icon
              className="h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            {item.name}
            <ChevronRightIcon
              className={concatClassNames(
                open ? "rotate-90 text-gray-500" : "text-gray-400",
                "h-5 w-5 shrink-0 sm:ml-auto"
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
              as="div"
              unmount={false}
              className="flex flex-col space-y-1">
              {item.children?.map((subItem: NavigationItem) => (
                <p key={subItem.name}>
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
                    {subItem.name}
                  </Disclosure.Button>
                </p>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
