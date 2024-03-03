import { ZendeskKbaImporter } from "@/lib/shared/services/zendesk/kba-import";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export type ZendeskWebhookPayload = {
  account_id: number;
  detail: Detail;
  event: Event;
  id: string;
  subject: string;
  time: string;
  type: string;
  zendesk_event_version: string;
};
type Detail = {
  brand_id: string;
  id: string;
};
type Event = {
  author_id: string;
  category_id: string;
  locale: string;
  section_id: string;
  title: string;
};

export async function POST(req: Request) {
  const webhookPayload = (await req.json()) as ZendeskWebhookPayload;
  const webhookAccountId = req.headers.get("x-wiselydesk-zendesk-account-id");

  if (!webhookAccountId) {
    return Response.json(
      { message: "Missing 'x-wiselydesk-zendesk-account-id' header" },
      { status: 400 }
    );
  }

  if (!webhookPayload) {
    return Response.json(
      { message: "Missing webhook payload" },
      { status: 400 }
    );
  }

  const articleId = webhookPayload.detail.id;

  try {
    const botIds = await (
      await prismaClient.bot.findMany({
        where: {
          zendesk_account_id: webhookAccountId
        },
        select: {
          id: true
        }
      })
    )?.map(bot => bot.id);

    if (!botIds || botIds.length === 0) {
      return Response.json({ message: "No bot found" }, { status: 500 });
    }

    const webhookResult = await handleWebhookPayload(
      webhookPayload.type,
      articleId,
      botIds
    );

    return Response.json(webhookResult);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const PUBLISHED_EVENT_TYPE = "zen:event-type:article.published";
const UNPUBLISHED_EVENT_TYPE = "zen:event-type:article.unpublished";

async function handleWebhookPayload(
  webhookType: string,
  articleId: string,
  botIds: number[]
) {
  let botId = botIds[0];
  if (botIds.length > 1) {
    botId = await handleMultipleBots(articleId);
  }
  const zendeskClient = new ZendeskKbaImporter(botId.toString());
  switch (webhookType) {
    case PUBLISHED_EVENT_TYPE:
      console.log("Updating KBA: ", articleId, " for bot: ", botId);
      await zendeskClient.importSingleKba(articleId);
      return { status: 200 };

    case UNPUBLISHED_EVENT_TYPE:
      console.log("Deleting KBA: ", articleId, " for bot: ", botId);
      await zendeskClient.deleteSingleKba(articleId);
      return { status: 200 };

    default:
      console.error(
        "Unhandled event type: ",
        webhookType,
        " for articleId: ",
        articleId
      );
      return { message: "Unhandled event type", status: 400 };
  }
}

async function handleMultipleBots(kbaId: string): Promise<number> {
  const botId = await prismaClient.knowledgeBaseArticle.findFirst({
    where: { client_article_id: kbaId },
    select: {
      bot_id: true
    }
  });
  if (!botId) {
    throw new Error(
      `Article with client_article_id ${kbaId} not found for any bot`
    );
  }
  return botId.bot_id;
}
