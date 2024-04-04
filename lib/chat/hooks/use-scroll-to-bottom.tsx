import { useEffect, useLayoutEffect, useRef } from "react";

type UseScrollToBottomProps = {
  messages: any[]; // Replace with your actual message type
  sources: any[]; // Replace with your actual source type
  lastConversationMessages?: any[];
};

export const useScrollToBottom = ({
  messages,
  sources,
  lastConversationMessages
}: UseScrollToBottomProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  function scrollToBottom(ref: React.MutableRefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  useLayoutEffect(() => {
    setTimeout(() => scrollToBottom(messagesEndRef), 100);
  }, [messages, sources, lastConversationMessages]);

  return messagesEndRef;
};
