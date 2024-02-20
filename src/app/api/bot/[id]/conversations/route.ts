import { PrismaClient } from "@prisma/client";
import { getAPIServerSession } from "@/lib/shared/auth";

const prisma = new PrismaClient();

type Params = {
  params: {
    publicConversationId: string;
    id: string;
  };
};

type WhereConditionType = {
  is_helpful?: boolean | null | undefined;
  bot_id: number;
  ticket_deflected?: boolean;
  to_review?: boolean;
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

function appendFilters(
  whereCondition: WhereConditionType,
  filterQuery: string | null
) {
  if (filterQuery === "deflected") {
    whereCondition = { ...whereCondition, ticket_deflected: true };
  } else if (filterQuery === "review") {
    whereCondition = { ...whereCondition, to_review: true };
  }
  return whereCondition;
}

export const GET = async (req: Request, { params }: Params) => {
  console.log("before");
  const session = await getAPIServerSession();
  console.log("after");

  const organizationId = parseInt(session.user.organization_id, 10);
  const botId = parseInt(params.id, 10);

  await validateBotAndOrg(botId, organizationId);

  const { searchParams } = new URL(req.url);
  const filterQuery = searchParams.get("filter");
  const isHelpfulQuery = searchParams.get("is_helpful");

  let whereCondition: WhereConditionType = {
    bot_id: botId
  };

  whereCondition = appendFilters(whereCondition, filterQuery);

  try {
    let conversations = await prisma.conversation.findMany({
      where: whereCondition,
      orderBy: {
        created_at: "desc"
      }
    });

    // hack to only get relevant conversations if is_helpful query is provided
    if (isHelpfulQuery) {
      const conversationIds = (
        await prisma.message.findMany({
          where: {
            conversation_id: { in: conversations.map(c => c.id) },
            is_helpful: strToBool(isHelpfulQuery)
          },
          select: {
            conversation_id: true
          }
        })
      ).map(m => m.conversation_id);

      conversations = conversations.filter(c => conversationIds.includes(c.id));
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
