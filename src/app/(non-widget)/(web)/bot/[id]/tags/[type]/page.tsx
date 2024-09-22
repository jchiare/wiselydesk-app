import prisma from "@/lib/prisma";
import { TagList } from "@/components/web/tags";
import type { ChatTagsType } from "@/lib/data/chat-tags/type";
import { Prisma } from "@prisma/client";
import { unstable_noStore } from "next/cache";

export default async function TagsPage({
  params
}: {
  params: { id: string; type: string };
}) {
  // Opt out of caching for this route
  unstable_noStore();

  const botId = parseInt(params.id, 10);
  const type = params.type;
  const taggedChats = (await prisma.chatTagging.findMany({
    where: {
      bot_id: botId,
      other: { not: Prisma.JsonNullValueFilter.JsonNull }
    },
    select: { id: true, conversation_id: true, other: true },
    orderBy: { created_at: "desc" }
  })) as unknown as {
    id: number;
    conversation_id: number;
    other: ChatTagsType;
  }[];
  const escalatedChats = await prisma.escalation.findMany({
    where: {
      bot_id: botId,
      conversation_id: { in: taggedChats.map(chat => chat.conversation_id) },
      deleted_at: null
    },
    select: { conversation_id: true }
  });

  const escalatedChatIds = new Set(
    escalatedChats.map(chat => chat.conversation_id)
  );

  let total = 0;
  const tagMap: Map<
    string,
    { count: number; subtags: { name: string; count: number }[] }
  > = new Map();
  const escalatedTagCount: Map<string, number> = new Map();
  for (const chat of taggedChats) {
    const tags = type === "ai" ? chat.other.ai_generated_tags : chat.other.tags;

    const tagInfo = tagMap.get(tags.name);
    if (tagInfo) {
      tagInfo.count++;
      for (const childTag of tags.children) {
        const existingSubtag = tagInfo.subtags.find(
          subtag => subtag.name === childTag
        );
        if (existingSubtag) {
          existingSubtag.count++;
        } else {
          tagInfo.subtags.push({ name: childTag, count: 1 });
        }
      }
    } else {
      const subtags = tags.children.map(child => ({ name: child, count: 1 }));
      tagMap.set(tags.name, {
        count: 1,
        subtags
      });
    }
    if (escalatedChatIds.has(chat.conversation_id)) {
      escalatedTagCount.set(
        tags.name,
        (escalatedTagCount.get(tags.name) || 0) + 1
      );
    }
    total++;
  }

  const sortedTags = Array.from(tagMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(entry => entry[0]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-4 items-center text-sm text-gray-500">
        {type !== "ai" ? "Not AI generated" : "AI generated"} chat tags
      </div>
      <div className="w-3/4 p-6">
        {sortedTags.map((tag, index) => (
          <TagList
            key={index + tag}
            tag={tag}
            usage={{
              chatsWithTagCount: tagMap.get(tag)?.count || 0,
              totalChats: total,
              escalatedCount: escalatedTagCount.get(tag) || 0,
              subtags: tagMap.get(tag)?.subtags || []
            }}
          />
        ))}
      </div>
    </div>
  );
}
