"use client";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "up" | "down" | "escalated";

type FilterButtonProps = {
  filter: FilterType;
  activeFilter: FilterType;
  href: string;
  icon: React.ReactNode;
  label: string;
};

function FilterButton({
  filter,
  activeFilter,
  href,
  icon,
  label
}: FilterButtonProps) {
  const isActive = activeFilter === filter;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center justify-center",
        isActive ? "text-blue-500" : "text-current",
        "transition-colors hover:text-blue-400"
      )}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}>
      {icon}
      <span
        className={cn(
          "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform",
          "rounded bg-black px-2 py-1 text-xs text-white",
          "opacity-0 transition-opacity group-hover:opacity-100",
          "pointer-events-none"
        )}>
        {label}
      </span>
    </Link>
  );
}

export default function ConversationsTableFilter({
  filter
}: {
  filter: FilterType;
}) {
  const { changeFilter } = useCustomQueryString();

  return (
    <nav
      className="flex items-center space-x-4"
      aria-label="Conversation filters">
      <FilterButton
        filter="all"
        activeFilter={filter}
        href={changeFilter("all")}
        icon="All"
        label="All conversations"
      />
      <FilterButton
        filter="up"
        activeFilter={filter}
        href={changeFilter("up")}
        icon={<ThumbsUpDown direction="up" />}
        label="Upvoted conversations"
      />
      <FilterButton
        filter="down"
        activeFilter={filter}
        href={changeFilter("down")}
        icon={<ThumbsUpDown direction="down" />}
        label="Downvoted conversations"
      />
      <FilterButton
        filter="escalated"
        activeFilter={filter}
        href={changeFilter("escalated")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        }
        label="Escalated conversations"
      />
    </nav>
  );
}
