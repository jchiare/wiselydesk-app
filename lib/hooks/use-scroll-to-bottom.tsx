import { useEffect, useRef } from "react";

type UseScrollToBottomProps = {
  messages: any[]; // Replace with your actual message type
  sources: any[]; // Replace with your actual source type
};

export const useScrollToBottom = ({
  messages,
  sources
}: UseScrollToBottomProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  function scrollToBottom(ref: React.MutableRefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages, sources]);

  return messagesEndRef;
};
