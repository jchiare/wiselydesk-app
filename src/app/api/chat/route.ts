import {
  parsePayload,
  parseBotId
} from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { KbaSearch } from "@/lib/shared/services/openai/rag";
import { getSystemMessagePrompt } from "@/lib/chat/prompts/system-prompts";
import { inputCost } from "@/lib/shared/services/openai/cost";
import { trimMessageUnder8KTokens } from "@/lib/shared/services/openai/cost";
import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";
import { OpenAILLM } from "@/lib/shared/services/llm/openai-llm";
import { AnthropicLLM } from "@/lib/shared/services/llm/anthropic-llm";
import { LLMService } from "@/lib/shared/services/llm/llm-service";
import { StreamingService } from "@/lib/shared/services/streaming/stream-service";

export const maxDuration = 75;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const startTime = Date.now();

  const payload = await req.json();
  const {
    model,
    messages,
    userInput,
    clientApiKey,
    clientSentConversationId,
    chatty
  } = parsePayload(payload);

  const botId = parseBotId(clientApiKey);

  const conversationService = new ConversationService(prisma, userInput, botId);
  const updatedUserInput = conversationService.getUpdatedUserInput();

  await conversationService.getOrCreateConversation(
    updatedUserInput,
    clientSentConversationId
  );

  const conversationId = conversationService.getConversationId();

  const message = await conversationService.createMessage({
    text: updatedUserInput,
    index: messages.length,
    finished: true
  });

  const kbaSearchClient = new KbaSearch(botId, prisma);
  const topMatchingArticles =
    await kbaSearchClient.getTopKArticlesObject(updatedUserInput);

  const { content, sources } =
    kbaSearchClient.createContextFromTopMatchingArticles(
      topMatchingArticles,
      4
    );

  const systemMessage = getSystemMessagePrompt(botId, content, true, chatty);
  const userAndAgentMessages = trimMessageUnder8KTokens(messages);

  const formattedSystemMessage: OpenAiMessage = {
    role: "system",
    content: systemMessage
  };
  let formattedMessages = [formattedSystemMessage, ...messages];
  formattedMessages = trimMessageUnder8KTokens(formattedMessages);

  const inputAiCost = inputCost(formattedMessages, model);

  const aiResponseMessage = await conversationService.createMessage({
    text: "",
    index: messages.length + 1,
    finished: false,
    apiResponseCost: inputAiCost
  });

  const openAiLLM = new OpenAILLM();
  const anthropicLLM = new AnthropicLLM();

  const llmService = new LLMService(
    model === "claude3.5" ? anthropicLLM : openAiLLM,
    model === "claude3.5" ? openAiLLM : anthropicLLM
  );

  const streamingService = new StreamingService();

  try {
    const { response, llm } = await llmService.streamWithFallback(
      systemMessage,
      userAndAgentMessages,
      { model }
    );

    const streamMetadata = {
      conversationId,
      messageId: message.id,
      sources,
      model,
      startTime,
      inputAiCost
    };

    const iterator = streamingService.createStreamIterator(
      response,
      llm,
      streamMetadata,
      conversationService,
      aiResponseMessage,
      formattedMessages
    );

    const responseStream = streamingService.createReadableStream(iterator);

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
        "Content-Encoding": "none"
      }
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
