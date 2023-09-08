"use client";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import Link from "next/link";

type FilterType = "all" | "up" | "down";

function colorActiveButton(filter: FilterType, activeFilter?: FilterType) {
  return activeFilter && activeFilter === filter
    ? "text-blue-500"
    : "text-current";
}

export default function ConversationsTableFilter({
  filter
}: {
  filter?: FilterType;
}) {
  const { createQueryString, pathname } = useCustomQueryString();

  return (
    <div className="flex items-center space-x-4">
      <Link
        className={colorActiveButton("all", filter)}
        href={pathname + "?" + createQueryString("filter", "all")}>
        All
      </Link>
      <Link
        className={colorActiveButton("up", filter)}
        href={pathname + "?" + createQueryString("filter", "up")}>
        <ThumbsUpDown direction="up" />
      </Link>
      <Link
        className={colorActiveButton("down", filter)}
        href={pathname + "?" + createQueryString("filter", "down")}>
        <ThumbsUpDown direction="down" />
      </Link>
    </div>
  );
}
