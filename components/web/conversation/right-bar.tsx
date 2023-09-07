import type { SingleConversationReturnType } from "@/dto/single-conversation";

export default function SideBar({
  conversation
}: {
  conversation: SingleConversationReturnType;
}) {
  return (
    <>
      <span className="font-semibold">Summary: </span>
      {conversation.conversation.summary}
      <br />
      <br />
      <span className="font-semibold">ID: </span>
      {conversation.conversation.public_id}
      <br />
      <br />
      <span className="font-semibold">Created At: </span>
      {conversation.conversation.created_at}
      <br />
      <br />
      <span className="font-semibold">Messages Count: </span>
      {conversation.conversation.messages.length}
    </>
  );
}
