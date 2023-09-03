import { useState } from "react";
import ChatMessage from "@/lib/chat-message";
import { transformChatMessageToOpenAi } from "@/lib/openai-chat-message";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { URL } from "@/lib/constants";

type UseChatSubmitParams = {
  initialMessages: ChatMessage[];
  clientApiKey: string;
  account: string;
  model: string | undefined;
  createSupportTicket: boolean;
};

export const useChatSubmit = ({
  initialMessages,
  clientApiKey,
  account,
  model,
  createSupportTicket
}: UseChatSubmitParams) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [assistantResponseFinished, setAssistantResponseFinished] =
    useState<boolean>(false);
  const [assistantStreamingResponse, setAssistantStreamingResponse] =
    useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [latestMessageId, setLatestMessageId] = useState<number | null>();
  const [conversationId, setConversationId] = useState<string | undefined>();

  async function onSubmit() {
    const updatedMessages = [
      ...messages,
      new ChatMessage({
        sender: "user",
        sentTime: ChatMessage.createSentTimeField(),
        text: input
      })
    ] as ChatMessage[];
    // send empty response to indicate to user that a reply is coming
    setMessages([
      ...updatedMessages,
      new ChatMessage({ sender: "assistant", text: "" })
    ]);
    setAssistantResponseFinished(false);
    setInput("");
    const preparedMessages = transformChatMessageToOpenAi(updatedMessages);

    const controller = new AbortController();

    fetchEventSource(`${URL}/api/conversation`, {
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
        createSupportTicket
      }),
      signal: controller.signal,
      async onopen() {
        console.log("Opened SSE connection");
        if (assistantResponseFinished) {
          setAssistantResponseFinished(false);
        }
      },
      openWhenHidden: true,
      onmessage(mes: any) {
        const event = mes.event as string | undefined;

        if (event === "closing_connection") {
          console.log("Server has no more messages. Closing SSE connection.");
          clearStreamingResponse();
          const serverData = JSON.parse(mes.data.replaceAll("'", '"')) as any;
          setSources(serverData.sources);
          if (!conversationId) {
            setConversationId(serverData.conversation_id);
          }

          setLatestMessageId(serverData.message_id);
          return controller.abort();
        }

        const data = JSON.parse(mes.data);
        let lastMessage = data.text as string | undefined;
        if (lastMessage?.includes("<NEWLINE>")) {
          lastMessage = lastMessage.replaceAll("<NEWLINE>", "\n");
        }

        const newStreamingResponse = assistantStreamingResponse + lastMessage;
        setAssistantStreamingResponse((a) => a + newStreamingResponse);
      },
      onclose() {
        console.log("Closing SSE connection");
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

  function clearStreamingResponse() {
    setAssistantStreamingResponse("");
    setAssistantResponseFinished(true);
  }
  return {
    messages,
    input,
    setInput,
    assistantResponseFinished,
    assistantStreamingResponse,
    onSubmit,
    sources,
    latestMessageId,
    conversationId
  };
};
