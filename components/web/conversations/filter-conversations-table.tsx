"use client";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import Link from "next/link";

type FilterType = "all" | "up" | "down";

function colorActiveButton(activeFilter: FilterType, filter: FilterType) {
  return activeFilter === filter ? "text-blue-500" : "text-current";
}

export default function ConversationsTableFilter({
  filter
}: {
  filter: FilterType;
}) {
  const { createQueryString, pathname } = useCustomQueryString();

  return (
    <div className="flex items-center space-x-4">
      <Link
        className={colorActiveButton(filter, "all")}
        href={pathname + "?" + createQueryString("filter", "all")}>
        All
      </Link>
      <Link
        className={colorActiveButton(filter, "up")}
        href={pathname + "?" + createQueryString("filter", "up")}>
        <ThumbsUpDown direction="up" />
      </Link>
      <Link
        className={colorActiveButton(filter, "down")}
        href={pathname + "?" + createQueryString("filter", "down")}>
        <ThumbsUpDown direction="down" />
      </Link>
    </div>
  );
}
