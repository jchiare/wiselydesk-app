import AgentMessage from "@/components/web/conversation/agent-message";
import UserMessage from "@/components/web/conversation/user-message";
import type {
  SingleConversationReturnType,
  Message
} from "@/dto/single-conversation";

function isMessageFromUser(message: Message) {
  return message.index % 2 > 0;
}

export default function SingleConversation({
  conversation
}: {
  conversation: SingleConversationReturnType;
}) {
  return (
    <>
      <div>
        {conversation.conversation.messages.map((message) => {
          return (
            <div key={message.id}>
              {isMessageFromUser(message) ? (
                <UserMessage
                  text={message.text}
                  sentTime={message.created_at}
                />
              ) : (
                <AgentMessage
                  text={message.text}
                  sentTime={message.created_at}
                  sources={message.sources}
                  isHelpful={message.is_helpful}
                  isFirstMessage={message.index === 0}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
