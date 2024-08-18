import prisma from "@/lib/prisma";

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

export async function Tags({
  conversationId,
  isLoading
}: {
  conversationId: number;
  isLoading: boolean | undefined;
}) {
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
