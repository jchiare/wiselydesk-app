"use client";
import { Subtags } from "./subtags";
import useCustomQueryString from "@/lib/web/use-custom-query-string";
import { useRouter } from "next/navigation";

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

  const { getBotId, createQueryString } = useCustomQueryString();
  const router = useRouter();

  const handleClick = () => {
    const botId = getBotId();
    const queryString = createQueryString("tags", tag);
    router.push(`/bot/${botId}/conversations/all?${queryString}`);
  };

  return (
    <div
      className="mb-4 cursor-pointer rounded-lg bg-white p-6 shadow-md transition-colors duration-200 hover:bg-blue-50"
      onClick={handleClick}>
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
          <span>{`${escalatedPercentage}% escalated`}</span>
        </div>
      </div>
      <Subtags subtags={sortedSubtags} />
    </div>
  );
}
