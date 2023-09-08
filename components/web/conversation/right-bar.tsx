import type { SingleConversationReturnType } from "@/dto/single-conversation";

export default function SideBar({
  conversation,
  isLoading
}: {
  conversation: SingleConversationReturnType;
  isLoading?: boolean;
}) {
  return (
    <>
      <span className="font-semibold">Summary: </span>
      <span className={isLoading ? "blur-sm" : ""}>
        {conversation.conversation.summary}
      </span>
      <br />
      <br />
      <span className="font-semibold">ID: </span>
      <span className={isLoading ? "blur-sm" : ""}>
        {conversation.conversation.public_id}
      </span>
      <br />
      <br />
      <span className="font-semibold">Created At: </span>
      <span className={isLoading ? "blur-sm" : ""}>
        {conversation.conversation.created_at}
      </span>
      <br />
      <br />
      <span className="font-semibold">Messages Count: </span>
      <span className={isLoading ? "blur-sm" : ""}>
        {conversation.conversation.messages.length}
      </span>
    </>
  );
}

//
