"use client";
import { useState } from "react";
import type {
  ChatTagsPostResponse,
  ChatTagsElement
} from "@/lib/data/chat-tags/type";
import { useRouter } from "next/navigation";

const Tag = ({
  text,
  isLoading,
  isChild
}: {
  text: string;
  isLoading?: boolean;
  isChild: boolean;
}) => (
  <span
    className={`mx-2 my-1 inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
      isChild
        ? "bg-blue-200 text-blue-900 dark:bg-blue-300 dark:text-blue-900"
        : "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800"
    } ${isLoading ? "blur-sm" : ""}`}>
    {text}
  </span>
);
const TagList = ({
  tags,
  title,
  tooltipText,
  isLoading
}: {
  tags: ChatTagsElement | undefined | null;
  title: string;
  tooltipText: string;
  isLoading?: boolean;
}) => (
  <div>
    <div className="flex items-center gap-x-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="group relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="lightgray"
          className="size-5 cursor-help">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
            clipRule="evenodd"
          />
        </svg>
        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block">
          <div className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
            {tooltipText}
          </div>
        </div>
      </div>
    </div>
    {tags && tags.name ? (
      <ul className="flex flex-wrap">
        <li className="m-1">
          <Tag text={tags.name} isLoading={isLoading} isChild={false} />
        </li>
        {tags.children && tags.children.length > 0 && (
          <ul className="ml-4 flex flex-wrap">
            {tags.children.map((child, index) => (
              <li key={index} className="m-1">
                <Tag text={child} isLoading={isLoading} isChild={true} />
              </li>
            ))}
          </ul>
        )}
      </ul>
    ) : (
      <p className="italic text-gray-500">No tags</p>
    )}
  </div>
);

export function Tags({
  tags,
  conversationId,
  isLoading: initialIsLoading,
  botId
}: {
  tags: ChatTagsPostResponse | { tags: null };
  conversationId: number;
  isLoading: boolean | undefined;
  botId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newlyCreatedTags, setNewlyCreatedTags] = useState<
    ChatTagsElement | null | undefined
  >(tags.tags);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<
    ChatTagsElement | null | undefined
  >(tags && "aiGeneratedTags" in tags ? tags.aiGeneratedTags : null);

  const createTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bot/${botId}/conversation/${conversationId}/tag`,
        {
          method: "POST",
          cache: "no-cache"
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create tags");
      }
      const data = (await response.json()) as ChatTagsPostResponse;
      setNewlyCreatedTags(data.tags);
      setAiGeneratedTags(data.aiGeneratedTags);
    } catch (error) {
      console.error("Error creating tags:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  if (initialIsLoading) {
    const fakeTags = {
      name: "loadingbig_things",
      children: ["hello", "newyork"]
    };
    return (
      <div className="space-y-4">
        <TagList
          tags={fakeTags}
          isLoading={initialIsLoading}
          title="Tags"
          tooltipText="Chat tags, chosen by AI from a list of tags"
        />
        <TagList
          tags={fakeTags}
          isLoading={initialIsLoading}
          title="AI Generated Tags"
          tooltipText="Chat tags, created by AI"
        />
      </div>
    );
  }
  if (newlyCreatedTags === null) {
    return (
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-gray-600">Untagged</p>
        <button
          onClick={createTags}
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? "Tagging..." : "Click to tag"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TagList
        tags={newlyCreatedTags}
        title="Tags"
        tooltipText="Chat tags, chosen by AI from a list of tags"
      />
      <TagList
        tags={aiGeneratedTags}
        title="AI Generated Tags"
        tooltipText="Chat tags, created by AI"
      />
    </div>
  );
}
