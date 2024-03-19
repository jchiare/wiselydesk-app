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
};
export type ConversationDTO = { conversations: ConversationExtended[] };

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

async function getConversations(
  botId: number,
  isEscalatedQuery: boolean | null,
  isHelpfulQuery: string | null
): Promise<ConversationExtended[]> {
  // Construct the where clause conditionally
  const whereClause: any = {
    bot_id: botId,
    created_at: {
      gte: new Date("2023-11-15")
    }
  };

  if (isEscalatedQuery) {
    whereClause.escalated = isEscalatedQuery;
  }

  if (isHelpfulQuery !== null) {
    whereClause.rating = isHelpfulQuery === "true" ? true : false;
  }

  const conversations: ConversationExtended[] =
    await prisma.conversation.findMany({
      where: whereClause,
      orderBy: {
        created_at: "desc"
      }
    });

  return conversations;
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

  try {
    const conversations = await getConversations(
      botId,
      isEscalatedQuery,
      isHelpfulQuery
    );

    if (isEscalatedQuery) {
      for (const conversation of conversations) {
        const escalation = await prisma.escalation.findFirst({
          where: { conversation_id: conversation.id }
        });

        if (escalation) {
          conversation.escalatedReason = escalation.reason;
        }
      }
    }

    if (conversations.length === 0) {
      return new Response(
        JSON.stringify({ message: "No conversations found" }),
        { status: 404 }
      );
    }

    return Response.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500
    });
  }
};
