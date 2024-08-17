import { parseBotId } from "@/lib/chat/conversation/parse-payload";
import { ConversationService } from "@/lib/chat/conversation";
import prisma from "@/lib/prisma";
import { AgentRequest } from "@/lib/agent-request";

export const maxDuration = 75;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const startTime = Date.now();

  const payload = await req.json();
  const clientSentConversationId = payload.conversationId;
  const messagesLength = payload.messagesLength;
  const userInput = payload.userInput;

  const botId = parseBotId(payload.clientApiKey);

  const conversationService = new ConversationService(prisma, userInput, botId);
  const updatedUserInput = conversationService.getUpdatedUserInput();

  await conversationService.getOrCreateConversation(
    updatedUserInput,
    clientSentConversationId
  );

  const conversationId = conversationService.getConversationId();

  // add user input
  await conversationService.createMessage({
    text: updatedUserInput,
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
