import React from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface SubtagProps {
  name: string;
  count: number;
}

interface SubtagsProps {
  subtags: SubtagProps[];
}

export function Subtags({ subtags }: SubtagsProps): React.ReactElement {
  const MAX_VISIBLE_SUBTAGS = 4;
  const visibleSubtags = subtags.slice(0, MAX_VISIBLE_SUBTAGS);
  const hiddenSubtags = subtags.slice(MAX_VISIBLE_SUBTAGS);
  return (
    <div className="mt-4 rounded bg-gray-100 p-4">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">Subtags</h3>
      {subtags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleSubtags.map(tag => (
            <div
              key={tag.name}
              className="flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200">
              <span>{tag.name}</span>
              <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold">
                {tag.count}
              </span>
            </div>
          ))}
          {hiddenSubtags.length > 0 && (
            <Popover className="relative">
              <PopoverButton className="group flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="mr-1">+{hiddenSubtags.length} more</span>
                <svg
                  className="h-4 w-4 transform transition-transform duration-200 group-aria-expanded:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </PopoverButton>
              <PopoverPanel className="absolute z-10 mt-2 w-64 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="max-h-60 overflow-y-auto">
                  {hiddenSubtags.map(tag => (
                    <div
                      key={tag.name}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-blue-50">
                      <span className="text-sm font-medium text-gray-700">
                        {tag.name}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
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
        <p className="text-sm text-gray-500">No subtags available</p>
      )}
    </div>
  );
}
