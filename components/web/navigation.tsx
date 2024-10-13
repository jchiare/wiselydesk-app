"use client";
import SideNavDisclosure from "@/components/web/side-nav-disclosure";
import {
  ChatBubbleBottomCenterTextIcon,
  ChartBarSquareIcon,
  TagIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/lib/utils";
import Link from "next/link";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

export type NavigationItem = {
  name: string;
  icon: any;
  href?: string;
  children?: NavigationItem[];
};

function createNavigation(botId: string): NavigationItem[] {
  return [
    {
      name: "Conversations",
      icon: ChatBubbleBottomCenterTextIcon,
      href: `/bot/${botId}/conversations/all`
    },
    {
      name: "Chat Tags",
      icon: TagIcon,
      href: `/bot/${botId}/tags/non_ai`
    },
    {
      name: "AI Chat Tags",
      icon: TagIcon,
      href: `/bot/${botId}/tags/ai`
    },
    {
      name: "Analytics",
      icon: ChartBarSquareIcon,
      children: [
        {
          name: "Conversations",
          icon: ChartBarSquareIcon,
          href: `/bot/${botId}/analytics/conversations/daily`
        },
        {
          name: "Tags",
          icon: ChartBarSquareIcon,
          href: `/bot/${botId}/analytics/escalations/daily`
        }
      ]
    }
  ];
}

export function Navigation() {
  const { getBotId, pathname } = useCustomQueryString();
  const botId = getBotId();
  const navigation = createNavigation(botId);

  const settingsItem = {
    name: "Settings",
    icon: Cog6ToothIcon,
    href: `/bot/${botId}/settings`
  };

  const currentItem = findCurrentItem([...navigation, settingsItem], pathname);

  return (
    <div className="flex w-full flex-col items-center space-y-1">
      {navigation.map(item =>
        !item?.children ? (
          <Link
            key={item.href!}
            href={item.href!}
            className={concatClassNames(
              item.href === currentItem?.href
                ? "bg-gray-700"
                : "hover:bg-gray-700",
              "flex w-full items-center justify-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-400 sm:justify-normal"
            )}>
            <item.icon
              className="h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ) : (
          <SideNavDisclosure
            key={item.name}
            currentItem={currentItem!}
            item={item}
          />
        )
      )}
      <div className="w-full pt-6">
        <div className="mb-4 border-t-2 border-gray-700" />
        <Link
          key={settingsItem.href!}
          href={settingsItem.href!}
          className={concatClassNames(
            settingsItem.href === currentItem?.href
              ? "bg-gray-700"
              : "hover:bg-gray-700",
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

function findCurrentItem(
  navigationItems: NavigationItem[],
  pathname: string
): NavigationItem | null {
  for (const item of navigationItems) {
    if (item.href === pathname) {
      return item;
    }
    if (item.children) {
      const childItem = findCurrentItem(item.children, pathname);
      if (childItem) {
        return childItem;
      }
    }
  }
  return null;
}
