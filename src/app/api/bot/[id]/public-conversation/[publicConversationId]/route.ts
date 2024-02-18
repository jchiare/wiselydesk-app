import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = {
  params: {
    id: string;
    publicConversationId: string;
  };
};

export const GET = async (req: Request, { params }: Params) => {
  const { id: botId, publicConversationId } = params;

  if (!botId) {
    return Response.json({ message: "Missing bot_id param" }, { status: 400 });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        public_id: parseInt(publicConversationId, 10),
        bot_id: parseInt(botId, 10)
      }
    });

    if (!conversation) {
      console.log(
        `Conversation '${publicConversationId}' for bot id '${botId}' doesn't exist`
      );
      return Response.json({}, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversation.id
      },
      orderBy: {
        created_at: "asc"
      }
    });

    const conversationReturnObject = {
      messages,
      ...conversation
    };

    return Response.json({ conversation: conversationReturnObject });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
