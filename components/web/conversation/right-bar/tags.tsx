"use client";
import { useState } from "react";
import type { ChatTagsType } from "@/lib/data/chat-tags/type";
import { useRouter } from "next/navigation";

const Tag = ({ text, isLoading }: { text: string; isLoading?: boolean }) => (
  <span
    className={`mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800 ${isLoading ? "blur-sm" : ""}`}>
    {text}
  </span>
);

const TagList = ({
  tags,
  title,
  tooltipText,
  isLoading
}: {
  tags: string[] | undefined | null;
  title: string;
  tooltipText: string;
  isLoading?: boolean;
}) => (
  <div>
    <div className="flex items-center gap-x-2">
      <h3 className={`font-semibold`}>{title}</h3>{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="lightgray"
        className="size-5 cursor-help"
        onMouseEnter={e => {
          const tooltip = document.createElement("div");
          tooltip.textContent = tooltipText;
          tooltip.className =
            "absolute bg-gray-800 text-white text-xs rounded px-2 py-1";
          tooltip.style.left = `${e.clientX}px`;
          tooltip.style.top = `${e.clientY - 30}px`;
          document.body.appendChild(tooltip);
        }}
        onMouseLeave={() => {
          const tooltip = document.querySelector("div.absolute");
          if (tooltip) document.body.removeChild(tooltip);
        }}>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    {tags && tags.length > 0 ? (
      <ul className="flex flex-wrap">
        {tags.map((tag, index) => (
          <li key={index} className="m-1">
            <Tag text={tag} isLoading={isLoading} />
          </li>
        ))}
      </ul>
    ) : (
      <p className={`italic text-gray-500`}>No tags</p>
    )}
  </div>
);

export function Tags({
  tags,
  conversationId,
  isLoading: initialIsLoading,
  botId
}: {
  tags: ChatTagsType;
  conversationId: number;
  isLoading: boolean | undefined;
  botId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newlyCreatedTags, setNewlyCreatedTags] = useState<
    string[] | null | undefined
  >(tags.tags);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[] | undefined>(
    tags.aiGeneratedTags
  );

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
      const data = (await response.json()) as ChatTagsType;
      console.log("data while creating tags: ", data);
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
    const fakeTags = ["tagging_bigoverhere"];
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

  console.log("newlyCreatedTags: ", newlyCreatedTags);
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
