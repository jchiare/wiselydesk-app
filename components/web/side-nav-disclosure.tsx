"use client";
import {
  ChatBubbleBottomCenterTextIcon,
  ChartBarSquareIcon
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { concatClassNames } from "@/lib/shared/utils";

export default function SideNavDisclosure({
  item,
  currentItem
}: {
  item: any;
  currentItem: any;
}): JSX.Element {
  return (
    <Disclosure as="div">
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
              className="h-6 w-6 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {item.name}
            <ChevronRightIcon
              className={concatClassNames(
                open ? "rotate-90 text-gray-500" : "text-gray-400",
                "ml-auto h-5 w-5 shrink-0"
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel as="ul" className="mt-1 px-2">
            {
              // @ts-expect-error .. there will be children eventually
              item.children.map((subItem) => (
                <li key={subItem.name}>
                  {/* 44px */}
                  <Disclosure.Button
                    as="a"
                    href={subItem.href}
                    className={concatClassNames(
                      // @ts-ignore
                      subItem.href === currentItem?.href
                        ? "bg-gray-700"
                        : "hover:bg-gray-700",
                      "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-400"
                    )}>
                    {subItem.name}
                  </Disclosure.Button>
                </li>
              ))
            }
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
