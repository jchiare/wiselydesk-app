import OpenAI from "openai";
import {
  parsePayload,
  parseBotId,
  removeWiselyDeskTestingKeyword
} from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { AgentRequest } from "@/lib/shared/agent-request";
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

const openai = new OpenAI();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const maxDuration = 75;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const startTime = Date.now();

  const payload = await req.json();
  const clientSentConversationId = payload.conversationId;
  const messagesLength = payload.messagesLength;
  let userInput = payload.userInput;
  let productionTesting = false;
  if (userInput.startsWith("wdtest")) {
    userInput = userInput.replace("wdtest ", "");
    productionTesting = true;
  }

  const botId = parseBotId(payload.clientApiKey);

  const conversationService = new ConversationService(
    prisma,
    productionTesting,
    botId
  );

  await conversationService.getOrCreateConversation(
    userInput,
    clientSentConversationId,
    undefined
  );

  const conversationId = conversationService.getConversationId();

  // add user input
  const message = await conversationService.createMessage({
    text: userInput,
    index: parseInt(messagesLength, 10),
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

  const agentRequest = new AgentRequest({ botId });
  const text = agentRequest.getResponse();

  return Response.json({ data: { text } });
}
