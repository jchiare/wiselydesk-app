import { PrismaClient, type Conversation } from "@prisma/client";

const prisma = new PrismaClient();

type Params = {
  params: {
    publicConversationId: string;
    id: string;
  };
};

type ConversationExtended = Conversation & {
  escalatedReason?: string;
  rating?: string;
};
export type ConversationDTO = {
  conversations: ConversationExtended[];
  totalConversations: number;
};

const strToBool = (value: string | null) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

async function validateBotAndOrg(botId: number, organizationId: number) {
  if (!botId || !organizationId) {
    return new Response(
      JSON.stringify({ message: "Missing required parameters" }),
      { status: 400 }
    );
  }

  const foundBotId = await prisma.bot.findFirst({
    where: {
      id: botId,
      organization_id: organizationId
    }
  });

  if (!foundBotId) {
    return new Response(JSON.stringify({ message: "Bot not found" }), {
      status: 404
    });
  }
}

export const GET = async (req: Request, { params }: Params) => {
  const session = { user: { organization_id: "2" } }; // hack for now .. implement server token validation at some time

  const organizationId = parseInt(session.user.organization_id, 10);
  const botId = parseInt(params.id, 10);

  await validateBotAndOrg(botId, organizationId);

  const { searchParams } = new URL(req.url);

  const filterQuery = searchParams.get("filter");
  const isEscalatedQuery = filterQuery === "escalated";

  const isHelpfulQuery = searchParams.get("is_helpful");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    let conversations: ConversationExtended[] =
      await prisma.conversation.findMany({
        where: {
          bot_id: botId,
          created_at: {
            gte: new Date("2023-11-15") // date AMBOSS started paying .. hacky .. need to add pagination at some point
          }
        },
        orderBy: {
          created_at: "desc"
        },
        skip,
        take: limit
      });

    const totalConversations = await prisma.conversation.count({
      where: {
        bot_id: botId,
        created_at: {
          gte: new Date("2023-11-15")
        }
      }
    });

    const ratingsObjects = (
      await prisma.message.findMany({
        where: {
          conversation_id: { in: conversations.map(c => c.id) },
          is_helpful: strToBool(isHelpfulQuery)
        },
        select: {
          conversation_id: true,
          is_helpful: true
        }
      })
    ).map(m => {
      return { conversationId: m.conversation_id, isHelpful: m.is_helpful };
    });

    for (const ratingsObject of ratingsObjects) {
      const conversation = conversations.find(
        c => c.id === ratingsObject.conversationId
      );
      if (conversation && ratingsObject.isHelpful !== null) {
        conversation.rating = ratingsObject.isHelpful ? "Positive" : "Negative";
      }
    }

    if (isHelpfulQuery) {
      conversations = conversations.filter(c =>
        ratingsObjects
          .map(ratingObject => ratingObject.conversationId)
          .includes(c.id)
      );
    }

    const escalatedObjects = (
      await prisma.escalation.findMany({
        where: {
          conversation_id: { in: conversations.map(c => c.id) }
        },
        select: {
          conversation_id: true,
          reason: true
        }
      })
    ).map(m => {
      return { conversationId: m.conversation_id, reason: m.reason };
    });

    for (const escalatedObject of escalatedObjects) {
      const conversation = conversations.find(
        c => c.id === escalatedObject.conversationId
      );
      if (conversation) {
        conversation.escalatedReason = escalatedObject.reason;
      }
    }

    if (isEscalatedQuery) {
      conversations = conversations.filter(c =>
        escalatedObjects
          .map(escalatedObject => escalatedObject.conversationId)
          .includes(c.id)
      );
    }

    if (conversations.length === 0) {
      return new Response(
        JSON.stringify({ message: "No conversations found" }),
        { status: 404 }
      );
    }

    return Response.json({ conversations, totalConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500
    });
  }
};
