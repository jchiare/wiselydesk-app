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
    <ul role="list" className="space-y-1">
      <li>
        <ul role="list" className="space-y-1">
          {navigation.map(item => (
            <li key={item.name}>
              {!item?.children ? (
                <Link
                  href={item.href}
                  className={concatClassNames(
                    item.href === currentItem?.href
                      ? "bg-gray-700"
                      : "hover:bg-gray-700",
                    "flex justify-center gap-x-4 rounded-md text-sm font-semibold leading-6 text-gray-400"
                  )}>
                  <item.icon
                    className=" h-4 w-4 shrink-0 text-gray-400 sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{item.name}</span>
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
