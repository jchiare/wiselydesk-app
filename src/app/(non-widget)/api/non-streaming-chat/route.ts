import { parseBotId } from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { AgentRequest } from "@/lib/shared/agent-request";

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
  await conversationService.createMessage({
    text: userInput,
    index: parseInt(messagesLength, 10) + 1,
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
  const agentText = agentRequest.getResponse();

  // add AI response
  await conversationService.createMessage({
    text: agentText,
    index: parseInt(messagesLength, 10) + 2,
    finished: true
  });

  return Response.json({ data: { text: agentText, conversationId } });
}
