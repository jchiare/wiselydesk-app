import type { ChatTagsType } from "@/lib/data/chat-tags/type";

type TagListProps = {
  tags: ChatTagsType | null;
  usage: string;
};

export function TagList({ tags, usage }: TagListProps) {
  console.log(tags);
  if (tags === null) {
    return;
  }
  const { tags: nonGeneratedTags, ai_generated_tags: aiGeneratedTags } = tags;

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm text-gray-500">{nonGeneratedTags.name}</h2>
          <h1 className="text-2xl font-bold">{nonGeneratedTags.name}</h1>
          <p className="text-sm text-gray-500">{nonGeneratedTags.name}</p>
        </div>
        <div className="flex space-x-4">
          {/* Bookmark Icon */}
          <button className="text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v18l7-5 7 5V3H5z"></path>
            </svg>
          </button>
          {/* Link Icon */}
          <button className="text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 13a5 5 0 010-10h4a5 5 0 010 10M10 11a5 5 0 010 10h4a5 5 0 010-10"></path>
            </svg>
          </button>
          {/* Settings Icon */}
          <button className="text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.341A8 8 0 1120 12v1a9 9 0 11-1.338 2.34"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
