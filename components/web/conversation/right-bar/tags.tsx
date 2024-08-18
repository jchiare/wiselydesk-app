import prisma from "@/lib/prisma";

const Tag = ({ text }: { text: string }) => (
  <span className="mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
    {text}
  </span>
);

const TagList = ({ tags, title }: { tags: string[]; title: string }) => (
  <div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {tags.length > 0 ? (
      <ul className="flex flex-wrap">
        {tags.map((tag, index) => (
          <li key={index} className="m-1">
            <Tag text={tag} />
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-500">No tags available</p>
    )}
  </div>
);

export async function Tags({ conversationId }: { conversationId: number }) {
  const chatTags = await prisma.chatTagging.findFirst({
    where: { conversation_id: conversationId }
  });

  if (!chatTags) {
    return <p className="text-gray-600">Untagged</p>;
  }

  const parseTags = (tagString: string | null) =>
    tagString
      ?.split(",")
      .map(tag => tag.trim())
      .filter(Boolean) || [];

  const tags = parseTags(chatTags.tags);
  const aiGeneratedTags = parseTags(chatTags.ai_generated_tags);
  const userTags = parseTags(chatTags.user_tags);

  return (
    <div className="space-y-4">
      <TagList tags={tags} title="Tags" />
      <TagList tags={aiGeneratedTags} title="AI Generated Tags" />
      <TagList tags={userTags} title="User Tags" />
    </div>
  );
}
