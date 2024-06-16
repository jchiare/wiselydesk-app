"use client";
import SideNavDisclosure from "@/components/web/side-nav-disclosure";
import {
  ChatBubbleBottomCenterTextIcon,
  ChartBarSquareIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/lib/shared/utils";
import Link from "next/link";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

export type NavigationItem = {
  name: string;
  icon: any;
  href?: string;
  children?: NavigationItem[];
};

const createNavigation = (botId: string) => [
  {
    name: "Conversations",
    icon: ChatBubbleBottomCenterTextIcon,
    href: `/bot/${botId}/conversations/all`
  },
  {
    name: "Ticket Tags",
    icon: TagIcon,
    href: `/bot/${botId}/tickets`
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
        name: "Escalations",
        icon: ChartBarSquareIcon,
        href: `/bot/${botId}/analytics/escalations/daily`
      }
    ]
  }
];

export default function Navigation() {
  const { getBotId, pathname } = useCustomQueryString();
  const botId = getBotId();
  const navigation = createNavigation(botId);

  const pathSegments = pathname
    .split("/")
    .map(segment => segment.toLowerCase());
  const thirdPathSegment = pathSegments[3];
  const fourthPathSegment = pathSegments[4];

  const currentItem = findCurrentItem(
    navigation,
    thirdPathSegment,
    fourthPathSegment
  );

  return (
    <div className="flex w-full flex-col items-center space-y-1">
      {navigation.map(item =>
        !item?.children ? (
          <Link
            key={item.href}
            href={item.href}
            className={concatClassNames(
              item.href === currentItem?.href
                ? "bg-gray-700"
                : "hover:bg-gray-700",
              "flex w-full items-center justify-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-400 sm:justify-normal"
            )}>
            <item.icon
              className=" h-5 w-5 shrink-0 text-gray-400 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ) : (
          <SideNavDisclosure
            key={item.name}
            currentItem={currentItem}
            item={item}
          />
        )
      )}
    </div>
  );
}

function findCurrentItem(
  navigation: any,
  thirdPathSegment: string,
  fourthPathSegment: string
) {
  for (const item of navigation) {
    if (thirdPathSegment === "analytics") {
      const matchingChild = item.children?.find((child: any) =>
        child.href.includes(fourthPathSegment)
      );
      if (matchingChild) {
        return matchingChild;
      }
    } else if (thirdPathSegment === "tickets" && item.name === "Ticket Tags") {
      return item;
    } else if (
      thirdPathSegment?.includes(item.name.toLowerCase().slice(0, -1))
    ) {
      return item;
    }
  }
  return null;
}
