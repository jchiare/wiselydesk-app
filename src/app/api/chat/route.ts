import OpenAI from "openai";
import {
  parsePayload,
  parseBotId,
  removeWiselyDeskTestingKeyword
} from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { type Message } from "@prisma/client";
import { KbaSearch } from "@/lib/shared/services/openai/rag";
import { getSystemMessagePrompt } from "@/lib/chat/prompts/system-prompts";

import type { Stream } from "openai/streaming";
import { buildSources } from "@/lib/chat/sources";

const openai = new OpenAI();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const maxDuration = 75;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const startTime = Date.now();

  const payload = await req.json();
  const {
    model,
    messages,
    userInput: uncheckedUserInput,
    clientApiKey,
    clientSentConversationId
  } = parsePayload(payload);

  const botId = parseBotId(clientApiKey);

  const [userInput, updatedMessages, isProductionTesting] =
    removeWiselyDeskTestingKeyword(messages, uncheckedUserInput);

  const conversationService = new ConversationService(
    prisma,
    isProductionTesting,
    botId
  );

  await conversationService.getOrCreateConversation(
    userInput,
    clientSentConversationId
  );

  const conversationId = conversationService.getConversationId();

  // add user input
  const message = await conversationService.createMessage({
    text: userInput,
    index: updatedMessages.length,
    finished: true
  });

  console.log(
    `Received message for conversation ${conversationId} on bot ${botId}`
  );

  console.log(
    `Took ${((Date.now() - startTime) / 1000).toFixed(
      4
    )} seconds to create initial conversation and messages`
  );

  const kbaSearchClient = new KbaSearch(botId, prisma);
  const topMatchingArticles =
    await kbaSearchClient.getTopKArticlesObject(userInput);

  console.log(
    `Took ${((Date.now() - startTime) / 1000).toFixed(
      4
    )} seconds to get top articles`
  );

  const { content, sources } =
    kbaSearchClient.createContextFromTopMatchingArticles(
      topMatchingArticles,
      4
    );

  const systemMessage = getSystemMessagePrompt(botId, content);
  const formattedSystemMessage: OpenAI.ChatCompletionMessageParam = {
    role: "system",
    content: systemMessage
  };

  const response = await openai.chat.completions.create({
    model,
    messages: [formattedSystemMessage, ...updatedMessages],
    stream: true
  });

  // save AI response before finishing to display in web app if
  // user quits mid-conversation
  const aiResponseMessage = await conversationService.createMessage({
    text: "",
    index: updatedMessages.length + 1,
    finished: false
  });

  const iterator = makeIterator(
    response,
    sources,
    conversationId,
    message.id,
    conversationService,
    aiResponseMessage
  );
  const stream = iteratorToStream(iterator);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none"
    }
  });
}

function iteratorToStream(
  iterator: AsyncGenerator<Uint8Array, void, unknown>
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    }
  });
}

async function* makeIterator(
  response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
  sources: string[],
  conversationId: number,
  messageId: number,
  conversationService: ConversationService,
  aiResponseMessage: Message
): AsyncGenerator<Uint8Array, void, undefined> {
  let fullResponse = "";

  // @ts-expect-error - TS doesn't know about the toReadableStream method well
  for await (const chunk of response.toReadableStream()) {
    const textChunk = decoder.decode(chunk, { stream: true });
    try {
      const jsonChunk = JSON.parse(
        textChunk
      ) as OpenAI.Chat.Completions.ChatCompletionChunk;

      const skipChunk = shouldSkipChunk(jsonChunk);
      if (!skipChunk) {
        const text = parseSSEMessageChunk(jsonChunk);
        fullResponse += jsonChunk.choices[0]?.delta?.content || "";
        yield encoder.encode(text);
      }
    } catch (error) {
      console.error("Error parsing JSON from chunk", error);
    }
  }

  const remainingText = decoder.decode();
  if (remainingText) {
    fullResponse += remainingText;
    yield encoder.encode(remainingText);
  }

  const formattedSources = buildSources(fullResponse, sources, true);
  const finalSSEResponse = createFinalSSEResponse(
    formattedSources,
    conversationId,
    messageId
  );

  await conversationService.updateMessage(aiResponseMessage.id, {
    text: fullResponse,
    finished: true,
    sources: formattedSources.length === 0 ? null : formattedSources.join(", ")
  });

  yield encoder.encode(finalSSEResponse);
}

function shouldSkipChunk(
  chunk: OpenAI.Chat.Completions.ChatCompletionChunk
): boolean {
  const content = chunk.choices[0]?.delta?.content;
  return content === "" || content === undefined;
}

function parseSSEMessageChunk(
  chunk: OpenAI.Chat.Completions.ChatCompletionChunk
): string {
  const text = JSON.stringify({ text: chunk.choices[0]?.delta?.content || "" });
  return `id: ${Date.now()}\nevent: message\ndata: ${text}\n\n`;
}

function createFinalSSEResponse(
  sources: string[],
  conversationId: number,
  messageId: number
): string {
  const data = JSON.stringify({
    sources,
    conversation_id: conversationId,
    message_id: messageId
  });
  return `id: ${Date.now()}\nevent: closing_connection\ndata: ${data}\n\n`;
}
