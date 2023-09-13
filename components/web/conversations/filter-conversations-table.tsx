"use client";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import Link from "next/link";

export type FilterType = "all" | "up" | "down" | "deflected" | "review";

function colorActiveButton(filter: FilterType, activeFilter?: FilterType) {
  return activeFilter && activeFilter === filter
    ? "text-blue-500"
    : "text-current";
}

export default function ConversationsTableFilter({
  filter
}: {
  filter: FilterType;
}) {
  const { changeFilter } = useCustomQueryString();

  return (
    <div className="flex items-center space-x-4">
      <Link
        className={colorActiveButton("all", filter)}
        href={changeFilter("all")}>
        All
      </Link>
      <Link
        className={`${colorActiveButton("up", filter)} group relative`}
        href={changeFilter("up")}>
        <ThumbsUpDown direction="up" />
        <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black p-1 text-xs text-white group-hover:block">
          Upvoted
        </span>
      </Link>
      <Link
        className={`${colorActiveButton("down", filter)} group relative`}
        href={changeFilter("down")}>
        <ThumbsUpDown direction="down" />
        <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black p-1 text-xs text-white group-hover:block">
          Downvoted
        </span>
      </Link>
      <Link
        className={`${colorActiveButton("deflected", filter)} group relative`}
        href={changeFilter("deflected")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black p-1 text-xs text-white group-hover:block">
          Deflected
        </span>
      </Link>

      <Link
        className={`${colorActiveButton("review", filter)} group relative`}
        href={changeFilter("review")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black p-1 text-xs text-white group-hover:block">
          Review
        </span>
      </Link>
    </div>
  );
}
