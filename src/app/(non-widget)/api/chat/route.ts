import OpenAI from "openai";
import {
  parsePayload,
  parseBotId,
  removeWiselyDeskTestingKeyword
} from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { KbaSearch } from "@/lib/shared/services/openai/rag";
import { getSystemMessagePrompt } from "@/lib/chat/prompts/system-prompts";
import { buildSources } from "@/lib/chat/sources";
import {
  inputCost,
  outputCost,
  trimMessageUnder8KTokens
} from "@/lib/shared/services/openai/cost";
import { getVisitorSessionId } from "@/lib/visitor/identify";

import type { Message } from "@prisma/client";
import type { Stream } from "openai/streaming";
import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";
import type { NextApiResponse } from "next";

const openai = new OpenAI();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const maxDuration = 75;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sessionId = await getVisitorSessionId();

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
    clientSentConversationId,
    sessionId
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

  // should send Generic Agent message
  console.log(userInput.trim().toLowerCase());
  if (userInput.trim().toLowerCase() === "agent") {
    if (botId === 3) {
      const agentMessage =
        "AMBOSS Support is online from Monday to Friday between 9am and 5pm EST. You can create a support ticket here to get an answer later or chat with me and I will do my best to help you with your request. <button create> Create Support Ticket</button create>";
      const lastMessage = await conversationService.createMessage({
        text: agentMessage,
        index: updatedMessages.length + 1,
        finished: true
      });

      const text = JSON.stringify({
        text: agentMessage,
        conversation_id: lastMessage.conversation_id,
        message_id: lastMessage.id
      });

      return new Response(
        `id: ${Date.now()}\nevent: patched_json_response\ndata: ${text}\n\n`,
        {
          headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "Content-Encoding": "none"
          }
        }
      );
    } else if (botId === 4) {
      const agentMessage =
        "Der AMBOSS Support ist von Montag bis Freitag zwischen 9-17 Uhr online. Du kannst hier ein Support-Ticket erstellen, um später eine Antwort zu erhalten oder mit mir chatten und ich werde mein Bestes tun, um dich bei deinem Anliegen zu unterstützen.  <button create> Support-Ticket erstellen</button create>";
      const lastMessage = await conversationService.createMessage({
        text: agentMessage,
        index: updatedMessages.length + 1,
        finished: true
      });

      return new Response(
        JSON.stringify({
          data: {
            text: agentMessage,
            conversation_id: lastMessage.conversation_id,
            message_id: lastMessage.id
          }
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "Content-Encoding": "none"
          }
        }
      );
    }
    throw new Error(`Bot ${botId} does not have a generic agent message`);
  }

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
  const formattedSystemMessage: OpenAiMessage = {
    role: "system",
    content: systemMessage
  };
  let formattedMessages = [formattedSystemMessage, ...updatedMessages];
  formattedMessages = trimMessageUnder8KTokens(formattedMessages);

  const inputAiCost = inputCost(formattedMessages, model);

  const response = await openai.chat.completions.create({
    model,
    messages: formattedMessages,
    stream: true
  });

  // save AI response before finishing to display in web app if
  // user quits mid-conversation
  const aiResponseMessage = await conversationService.createMessage({
    text: "",
    index: updatedMessages.length + 1,
    finished: false,
    apiResponseCost: inputAiCost
  });

  const iterator = makeIterator(
    response,
    sources,
    conversationId,
    message.id,
    conversationService,
    aiResponseMessage,
    model,
    inputAiCost,
    formattedMessages,
    startTime
  );
  const responseStream = iteratorToStream(iterator);

  return new Response(responseStream, {
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
  aiResponseMessage: Message,
  model: string,
  inputAiCost: number,
  formattedMessages: OpenAiMessage[],
  startTime: number
): AsyncGenerator<Uint8Array, void, undefined> {
  let fullResponse = "";
  let modelVersion: string | undefined = undefined;

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

        if (!modelVersion) {
          modelVersion = jsonChunk.model;
        }

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

  const aiMessage = {
    text: fullResponse,
    finished: true,
    sources: formattedSources.length === 0 ? null : formattedSources.join(", "),
    apiResponseCost: inputAiCost + outputCost(fullResponse, model)
  };

  await conversationService.updateMessage(aiResponseMessage.id, aiMessage);

  await prisma.aiInput.create({
    data: {
      botId: aiResponseMessage.bot_id,
      conversationId: conversationId,
      messageId: aiResponseMessage.id,
      log: {
        aiMessage,
        modelVersion,
        formattedMessages,
        responseTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      }
    }
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
