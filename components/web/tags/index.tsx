"use client";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

type TagListProps = {
  tag: string;
  usage: {
    chatsWithTagCount: number | undefined;
    totalChats: number;
    escalatedCount: number | undefined;
    subtags: {
      name: string;
      count: number;
    }[];
  };
};

export function TagList({ tag, usage }: TagListProps) {
  const {
    chatsWithTagCount = 0,
    totalChats,
    escalatedCount = 0,
    subtags
  } = usage;
  const tagPercentage = ((chatsWithTagCount / totalChats) * 100).toFixed(1);
  const escalatedPercentage = (
    (escalatedCount / (chatsWithTagCount || 1)) *
    100
  ).toFixed(1);

  const sortedSubtags = subtags.sort((a, b) => b.count - a.count);
  const visibleSubtags = sortedSubtags.slice(0, 6);
  const hiddenSubtags = sortedSubtags.slice(0);

  return (
    <div className="mb-4 rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">{tag}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {`${chatsWithTagCount} out of ${totalChats} chats (${tagPercentage}%)`}
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          <span>{`${escalatedCount} escalated (${escalatedPercentage}%)`}</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-2 text-base font-semibold text-gray-700">Subtags</h3>
        {subtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {visibleSubtags.map(tag => (
              <div
                key={tag.name}
                className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100">
                <span>{tag.name}</span>
                <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold">
                  {tag.count}
                </span>
              </div>
            ))}
            {hiddenSubtags.length > 0 && (
              <Popover className="relative">
                <PopoverButton className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100">
                  +{hiddenSubtags.length} more
                </PopoverButton>
                <PopoverPanel
                  className="absolute z-10 mt-2 w-64 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5"
                  anchor={{
                    to: "bottom",
                    gap: "0.5rem",
                    padding: "8px"
                  }}
                  transition
                  focus>
                  <div className="max-h-60 overflow-y-auto">
                    {hiddenSubtags.map(tag => (
                      <div
                        key={tag.name}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-blue-100">
                        <span className="text-sm font-medium text-blue-600">
                          {tag.name}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                          {tag.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No subtags</p>
        )}
      </div>
    </div>
  );
}
