import OpenAI from "openai";
import {
  parsePayload,
  parseBotId,
  removeWiselyDeskTestingKeyword
} from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import { PrismaClient } from "@prisma/client";
import { KbaSearch } from "@/lib/shared/services/openai/rag";

import type { Stream } from "openai/streaming";

const prisma = new PrismaClient();
const openai = new OpenAI();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

  // add user input
  await conversationService.createMessage({
    text: userInput,
    index: updatedMessages.length - 1,
    finished: false
  });

  console.log(
    `Received message for conversation ${conversationService.getConversationId()} on bot ${botId}`
  );

  console.log(
    `Took ${((Date.now() - startTime) / 1000).toFixed(
      4
    )} seconds to create initial conversation and messages`
  );

  const kbaSearchClient = new KbaSearch(botId, prisma);
  const topMatchingArticles =
    await kbaSearchClient.getTopKArticlesObject(userInput);
  // console.log("top route: ", topMatchingArticles);
  console.log(
    `Took ${((Date.now() - startTime) / 1000).toFixed(
      4
    )} seconds to get top articles`
  );

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: "Say this is a testing 3 times" }],
    stream: true
  });

  const iterator = makeIterator(response);
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
  response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
): AsyncGenerator<Uint8Array, void, undefined> {
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
        yield encoder.encode(text);
      }
    } catch (error) {
      console.error("Error parsing JSON from chunk", error);
    }
  }

  const remainingText = decoder.decode();
  if (remainingText) {
    console.log("remaing text??");
    yield encoder.encode(remainingText);
  }

  const finalSSEResponse = createFinalSSEResponse();
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

function createFinalSSEResponse(): string {
  const data = JSON.stringify({
    sources: [],
    conversation_id: "",
    message_id: ""
  });
  return `id: ${Date.now()}\nevent: closing_connection\ndata: ${data}\n\n`;
}
