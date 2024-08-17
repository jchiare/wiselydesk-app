import { ZendeskKbaImporter } from "@/lib/shared/services/zendesk/kba-import";
import prisma from "@/lib/prisma";

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
  const locale = webhookPayload.event.locale;

  try {
    const bots = await prisma.bot.findMany({
      where: {
        zendesk_account_id: webhookAccountId
      },
      select: {
        id: true
      }
    });
    const botIds = bots?.map(bot => bot.id);

    if (!botIds || botIds.length === 0) {
      return Response.json({ message: "No bot found" }, { status: 500 });
    }

    const webhookResult = await handleWebhookPayload(
      webhookPayload.type,
      articleId,
      botIds,
      locale
    );

    return Response.json(
      {
        message: webhookResult.message
      },
      { status: webhookResult.status }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return Response.json(
      { error: `Internal Server Error with error ${error}` },
      { status: 500 }
    );
  }
}

const PUBLISHED_EVENT_TYPE = "zen:event-type:article.published";
const UNPUBLISHED_EVENT_TYPE = "zen:event-type:article.unpublished";

async function handleWebhookPayload(
  webhookType: string,
  articleId: string,
  botIds: number[],
  locale: string | undefined
) {
  let botId = botIds[0];
  if (botIds.length > 1) {
    botId = await handleMultipleBots(articleId, locale);
  }
  const zendeskClient = new ZendeskKbaImporter(botId.toString());
  switch (webhookType) {
    case PUBLISHED_EVENT_TYPE:
      await zendeskClient.importSingleKba(articleId);
      return {
        message: `Updated kbaId ${articleId} for botId ${botId}`,
        status: 200
      };

    case UNPUBLISHED_EVENT_TYPE:
      await zendeskClient.deleteSingleKba(articleId);
      return {
        message: `Deleted kbaId ${articleId} for botId ${botId}`,
        status: 200
      };

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

async function handleMultipleBots(
  kbaId: string,
  locale: string | undefined
): Promise<number> {
  // default to WiselyDesk

  if (locale) {
    if (locale === "en-us") {
      return 3;
    } else if (locale === "de") {
      return 4;
    }
    throw new Error(`Unhandled locale: ${locale}`);
  }

  // handle if there is no locale in the webhook
  const bot = await prisma.knowledgeBaseArticle.findFirst({
    where: { client_article_id: kbaId },
    select: {
      bot_id: true
    }
  });
  if (!bot) {
    throw new Error(
      `Article with client_article_id ${kbaId} not found for any bot`
    );
  }
  return bot.bot_id;
}
