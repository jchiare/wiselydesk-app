import prisma from "@/lib/prisma";

import Link from "next/link";
import { TagList } from "@/components/web/tags";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import type { ChatTagsType } from "@/lib/data/chat-tags/type";
import { Prisma } from "@prisma/client";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
    {children}
  </span>
);

export default async function TicketPage({
  params
}: {
  params: { id: string; type: string };
}) {
  const botId = parseInt(params.id, 10);
  const type = params.type;
  const taggedChats = (await prisma.chatTagging.findMany({
    where: {
      bot_id: botId,
      other: { not: Prisma.JsonNullValueFilter.JsonNull }
    },
    select: { id: true, conversation_id: true, other: true },
    orderBy: { created_at: "desc" },
    take: 10
  })) as unknown as {
    id: number;
    conversation_id: number;
    other: ChatTagsType;
  }[];

  const relevantChats = taggedChats.map(chat => {
    const tags = type === "ai" ? chat.other.ai_generated_tags : chat.other.tags;
    return {
      conversation_id: chat.conversation_id,
      tags: tags
    };
  });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-4 items-center text-sm text-gray-500">
        {type !== "ai" ? "None AI generated" : "AI generated"} chat tags
      </div>
      <div className="w-[90%] p-6">
        {relevantChats.map((chat, index) => (
          <TagList
            key={index + chat.conversation_id}
            tags={chat.tags}
            usage={"Everywhere"}
          />
        ))}
      </div>
    </div>
  );
}
