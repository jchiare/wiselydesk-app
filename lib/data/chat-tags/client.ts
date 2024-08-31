import type { ChatTagsType } from "@/lib/data/chat-tags/type";

export async function getTagsClientSide(
  botId: string,
  conversationId: number
): Promise<ChatTagsType> {
  const response = await fetch(
    `/api/bot/${botId}/conversation/${conversationId}/tag`,
    {
      method: "GET",
      cache: "no-cache"
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  return (await response.json()) as ChatTagsType;
}
