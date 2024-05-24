import { useState, useEffect } from "react";
import ChatMessage from "@/lib/chat/chat-message";
import { transformChatMessageToOpenAi } from "@/lib/chat/openai-chat-message";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import { useAtom } from "jotai";
import { conversationIdAtom } from "@/lib/state/atoms";

type UseChatSubmitParams = {
  initialMessages: ChatMessage[];
  clientApiKey: string;
  account: string;
  model: string | undefined;
  createSupportTicket: boolean;
  inlineSources: boolean;
  lastConversationId?: number;
  setInput: (input: string) => void;
  input: string;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
};

export const useChatSubmit = ({
  initialMessages,
  clientApiKey,
  account,
  model,
  createSupportTicket,
  inlineSources,
  lastConversationId,
  setInput,
  messages,
  setMessages,
  input
}: UseChatSubmitParams) => {
  const [aiResponseDone, setAiResponseDone] = useState<boolean>(true);
  const [assistantStreamingResponse, setAssistantStreamingResponse] =
    useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [latestMessageId, setLatestMessageId] = useState<number | null>();
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);

  async function onSubmit() {
    const updatedMessages = [
      ...messages,
      new ChatMessage({
        sender: "user",
        text: input
      })
    ] as ChatMessage[];

    // send empty response to indicate to user that a reply is coming
    setMessages([
      ...updatedMessages,
      new ChatMessage({ sender: "assistant", text: "" })
    ]);
    setAiResponseDone(false);
    setInput("");

    const preparedMessages = transformChatMessageToOpenAi(updatedMessages);

    const controller = new AbortController();

    fetchEventSource(`${NEXTJS_BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: preparedMessages,
        secret: process.env.NEXT_PUBLIC_SECRET_API_KEY,
        clientApiKey,
        account,
        model,
        conversationId,
        createSupportTicket,
        inlineSources
      }),
      signal: controller.signal,
      async onopen() {
        console.log("Opened SSE connection");
        if (aiResponseDone) {
          setAiResponseDone(false);
        }
      },
      openWhenHidden: true,
      onmessage(mes: any) {
        const event = mes.event as string | undefined;

        if (event === "closing_connection") {
          console.log("Server has no more messages. Closing SSE connection.");
          clearStreamingResponse();
          const serverData = JSON.parse(mes.data);
          setSources(serverData.sources);
          if (!conversationId) {
            setConversationId(serverData.conversation_id);
          }

          setLatestMessageId(serverData.message_id);
          return controller.abort();
        }

        const message = JSON.parse(mes.data).text;
        const newStreamingResponse = assistantStreamingResponse + message;
        setAssistantStreamingResponse(
          response => response + newStreamingResponse
        );
      },
      onclose() {
        console.log("Closing SSE connection!");
        clearStreamingResponse();
        controller.abort();
      },
      // To close the SSE connection client side, you need to throw an error
      onerror(e: any) {
        console.error(e);
        setAssistantStreamingResponse(
          "We're sorry, there was an error with our server. Please refresh the page and try again, or contact support."
        );
        throw new Error("Hack to close SSE connection client side", {
          cause: "manuallyCancelSSE"
        });
      }
    }).catch((e: any) => {
      if (e.cause === "manuallyCancelSSE") {
        return;
      }
      throw new Error(e);
    });
  }

  useEffect(() => {
    if (aiResponseDone === true) {
      return;
    }

    if (assistantStreamingResponse) {
      // Update the last AI message with the streaming response
      // @ts-expect-error shhh
      setMessages(prevMessages => {
        const lastAssistantAnswer = prevMessages.slice(-1)[0];
        lastAssistantAnswer.text = assistantStreamingResponse;
        return [
          ...prevMessages.slice(0, prevMessages.length - 1),
          lastAssistantAnswer
        ];
      });
    }
  }, [aiResponseDone, assistantStreamingResponse]);

  function clearStreamingResponse() {
    setAssistantStreamingResponse("");
    setAiResponseDone(true);
  }
  return {
    messages,
    input,
    setInput,
    aiResponseDone,
    onSubmit,
    sources,
    latestMessageId,
    conversationId,
    setAiResponseDone
  };
};
