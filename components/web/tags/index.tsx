type TagListProps = {
  tag: string;
  usage: {
    chatsWithTagCount: number | undefined;
    totalChats: number;
    escalatedCount: number | undefined;
  };
};

export function TagList({ tag, usage }: TagListProps) {
  const { chatsWithTagCount = 0, totalChats, escalatedCount = 0 } = usage;
  const tagPercentage = ((chatsWithTagCount / totalChats) * 100).toFixed(1);
  const escalatedPercentage = (
    (escalatedCount / (chatsWithTagCount || 1)) *
    100
  ).toFixed(1);

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tag}</h1>
          <h2 className="text-sm italic text-gray-500">{`${chatsWithTagCount} out of ${totalChats} chats (${tagPercentage}%)`}</h2>
        </div>
        <div className="flex flex-col justify-start">
          <p className="flex items-center text-sm italic text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 size-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            {`${escalatedCount} escalated (${escalatedPercentage}%)`}
          </p>
        </div>
      </div>
    </div>
  );
}
