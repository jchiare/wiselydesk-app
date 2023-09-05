import {
  ChatBubbleBottomCenterTextIcon,
  ChartBarSquareIcon
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/lib/shared/utils";
import Image from "next/image";
// import BotSelector from "@/components/BotSelector";
// import type { LayoutProps } from "@/components/Layout";
import SideNavDisclosure from "@/components/web/side-nav-disclosure";

const navigation = [
  {
    name: "Conversations",
    icon: ChatBubbleBottomCenterTextIcon,
    href: "/web/conversations"
  },
  {
    name: "Analytics",
    icon: ChartBarSquareIcon,
    href: "/web/analytics"
  }
];

export default function SideNav({ selectedBot, setSelectedBot, session }: any) {
  const currentItem = navigation.find((item) => item.href === "conversations");
  return (
    <div className="flex w-64 flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-800 px-6">
        <div className="flex h-16 flex-col items-center">
          {/* <BotSelector
            selectedBot={selectedBot}
            setSelectedBot={setSelectedBot}
            session={session}
          /> */}
        </div>
        <div className="mt-[20px] flex" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {
                      // @ts-expect-error .. there will be children eventually
                      !item?.children ? (
                        <a
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
                        </a>
                      ) : (
                        <SideNavDisclosure
                          currentItem={currentItem}
                          item={item}
                        />
                      )
                    }
                  </li>
                ))}
              </ul>
            </li>

            <li className="-mx-6 mt-auto">
              <hr className="border text-gray-400" />
              <div className="flex items-center justify-center gap-x-4 py-3 pr-6 text-sm font-semibold leading-6 text-gray-400 hover:cursor-pointer hover:bg-gray-600">
                <div className="flex items-center">
                  <div>
                    <span className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={
                          session?.user?.image ?? "/profile_picture_backup.png"
                        }
                        alt="Profile Picture"
                        width={40}
                        height={40}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
