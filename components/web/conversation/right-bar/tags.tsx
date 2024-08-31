"use client";
import { useState, useEffect } from "react";
import type { ChatTagsType } from "@/lib/data/chat-tags/type";

const Tag = ({ text, isLoading }: { text: string; isLoading?: boolean }) => (
  <span
    className={`mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800 ${isLoading ? "blur-sm" : ""}`}>
    {text}
  </span>
);

const TagList = ({
  tags,
  title,
  isLoading
}: {
  tags: string[] | undefined | null;
  title: string;
  isLoading?: boolean;
}) => (
  <div>
    <h3 className={`font-semibold`}>{title}</h3>
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
  const [isLoading, setIsLoading] = useState(false);
  const [newlyCreatedTags, setNewlyCreatedTags] = useState<
    string[] | null | undefined
  >(tags.tags);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[] | undefined>(
    tags.aiGeneratedTags
  );
  const [userTags, setUserTags] = useState<string[] | undefined>(tags.userTags);

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
      setNewlyCreatedTags(data.tags);
      setAiGeneratedTags(data.aiGeneratedTags);
      setUserTags(data.userTags);
    } catch (error) {
      console.error("Error creating tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialIsLoading) {
    const fakeTags = ["tagging_bigoverhere"];
    return (
      <div className="space-y-4">
        <TagList tags={fakeTags} isLoading={initialIsLoading} title="Tags" />
        <TagList
          tags={fakeTags}
          isLoading={initialIsLoading}
          title="AI Generated Tags"
        />
        <TagList
          tags={fakeTags}
          isLoading={initialIsLoading}
          title="User Tags"
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
      <TagList tags={newlyCreatedTags} title="Tags" />
      <TagList tags={aiGeneratedTags} title="AI Generated Tags" />
      <TagList tags={userTags} title="User Tags" />
    </div>
  );
}
