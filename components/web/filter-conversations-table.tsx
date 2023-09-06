"use client";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type FilterType = "all" | "up" | "down";

function colorActiveButton(activeFilter: FilterType, filter: FilterType) {
  return activeFilter === filter ? "text-blue-500" : "text-current";
}

export default function ConversationsTableFilter({
  filter
}: {
  filter: FilterType;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
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
