"use client";
import { useEffect, useState } from "react";

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
  tags: string[];
  title: string;
  isLoading?: boolean;
}) => (
  <div>
    <h3 className={`font-semibold`}>{title}</h3>
    {tags.length > 0 ? (
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
  conversationId,
  isLoading: initialIsLoading,
  botId
}: {
  conversationId: number;
  isLoading: boolean | undefined;
  botId: string;
}) {
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const [tags, setTags] = useState<string[]>([]);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bot/${botId}/conversation/${conversationId}/tag`,
        {
          method: "GET",
          cache: "no-store"
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(parseTags(data.tags));
      setAiGeneratedTags(parseTags(data.ai_generated_tags));
      setUserTags(parseTags(data.user_tags));
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const createTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bot/${botId}/conversation/${conversationId}/tag`,
        {
          method: "POST",
          cache: "no-store"
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data.tags ?? []);
      setAiGeneratedTags(data.ai_generated_tags ?? []);
      setUserTags(data.user_tags ?? []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseTags = (tagString: string | null) =>
    tagString
      ?.split(",")
      .map(tag => tag.trim())
      .filter(Boolean) || [];

  if (isLoading) {
    const fakeTags = ["tagging_bigoverhere"];
    return (
      <div className="space-y-4">
        <TagList tags={fakeTags} isLoading={isLoading} title="Tags" />
        <TagList
          tags={fakeTags}
          isLoading={isLoading}
          title="AI Generated Tags"
        />
        <TagList tags={fakeTags} isLoading={isLoading} title="User Tags" />
      </div>
    );
  }

  if (
    tags.length === 0 &&
    aiGeneratedTags.length === 0 &&
    userTags.length === 0
  ) {
    return (
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-gray-600">Untagged</p>
        <button
          onClick={() => createTags()}
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? "Tagging..." : "Click to tag"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TagList tags={tags} title="Tags" />
      <TagList tags={aiGeneratedTags} title="AI Generated Tags" />
      <TagList tags={userTags} title="User Tags" />
    </div>
  );
}
