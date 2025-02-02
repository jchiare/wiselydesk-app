import openai from "@/lib/shared/services/openai";
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

  // Parse the incoming request
  const payload = await req.json();
  const {
    model,
    messages,
    userInput,
    clientApiKey,
    clientSentConversationId,
    chatty,
    location
  } = parsePayload(payload);

  const botId = parseBotId(clientApiKey);

  // Initialize conversation service
  const conversationService = new ConversationService(prisma, userInput, botId);
  const updatedUserInput = conversationService.getUpdatedUserInput();

  // Create or get conversation
  await conversationService.getOrCreateConversation(
    updatedUserInput,
    clientSentConversationId
  );

  const conversationId = conversationService.getConversationId();

  // Create initial user message
  const message = await conversationService.createMessage({
    text: updatedUserInput,
    index: messages.length,
    finished: true
  });

  // Get relevant articles using KBA search
  const kbaSearchClient = new KbaSearch(botId, prisma);
  const topMatchingArticles =
    await kbaSearchClient.getTopKArticlesObject(updatedUserInput);

  const { content, sources } =
    kbaSearchClient.createContextFromTopMatchingArticles(
      topMatchingArticles,
      4
    );

  // Prepare messages for LLM
  const systemMessage = getSystemMessagePrompt(botId, content, true, chatty);
  const userAndAgentMessages = trimMessageUnder8KTokens(messages);

  const formattedSystemMessage: OpenAiMessage = {
    role: "system",
    content: systemMessage
  };
  let formattedMessages = [formattedSystemMessage, ...messages];
  formattedMessages = trimMessageUnder8KTokens(formattedMessages);

  const inputAiCost = inputCost(formattedMessages, model);

  // Create AI response message (empty initially)
  const aiResponseMessage = await conversationService.createMessage({
    text: "",
    index: messages.length + 1,
    finished: false,
    apiResponseCost: inputAiCost
  });

  // Initialize LLM services
  const openAiLLM = new OpenAILLM(openai);
  const anthropicLLM = new AnthropicLLM();

  const llmService = new LLMService(
    model === "claude3.5" ? anthropicLLM : openAiLLM,
    model === "claude3.5" ? openAiLLM : anthropicLLM
  );

  // Initialize streaming service
  const streamingService = new StreamingService();

  try {
    // Get LLM response with fallback
    const { response, llm } = await llmService.streamWithFallback(
      systemMessage,
      userAndAgentMessages,
      { model }
    );

    // Prepare metadata for streaming
    const streamMetadata = {
      conversationId,
      messageId: message.id,
      sources,
      model,
      startTime,
      inputAiCost
    };

    // Create stream iterator
    const iterator = streamingService.createStreamIterator(
      response,
      llm,
      streamMetadata,
      conversationService,
      aiResponseMessage,
      formattedMessages
    );

    // Create readable stream
    const responseStream = streamingService.createReadableStream(iterator);

    // Return streaming response
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
