"use client";
import SideNavDisclosure from "@/components/web/side-nav-disclosure";
import {
  ChatBubbleBottomCenterTextIcon,
  ChartBarSquareIcon
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/lib/shared/utils";
import Link from "next/link";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

const createNavigation = (botId: string) => [
  {
    name: "Conversations",
    icon: ChatBubbleBottomCenterTextIcon,
    href: `/bot/${botId}/conversations/all`,
    children: null
  },
  {
    name: "Analytics",
    icon: ChartBarSquareIcon,
    href: `/bot/${botId}/analytics/daily/stacked`,
    children: null
  }
];

export default function Navigation() {
  const { getBotId, pathname } = useCustomQueryString();
  const botId = getBotId();
  const navigation = createNavigation(botId);
  const currentItem = navigation.find(item =>
    pathname.includes(item.name.toLowerCase())
  );

  return (
    <ul role="list" className="-mx-0 space-y-1">
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          {navigation.map(item => (
            <li key={item.name}>
              {!item?.children ? (
                <Link
                  href={item.href}
                  className={concatClassNames(
                    item.href === currentItem?.href
                      ? "bg-gray-700"
                      : "hover:bg-gray-700",
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400"
                  )}>
                  <item.icon
                    className="h-6 w-6 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ) : (
                <SideNavDisclosure currentItem={currentItem} item={item} />
              )}
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}
