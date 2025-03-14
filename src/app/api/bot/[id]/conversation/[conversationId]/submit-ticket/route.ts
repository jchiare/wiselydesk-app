import { ZendeskClient, type TicketOptions } from "@/lib/chat/zendesk";
import prisma from "@/lib/prisma";
type Params = {
  params: { id: string; conversationId: string };
};

type RequestBody = {
  email: string;
  summary: string;
  transcript: string;
  additionalInfo: string;
  locale: string;
  name: string;
  contactReason: string;
};

export const POST = async (request: Request, { params }: Params) => {
  const body = await request.json();
  const { id, conversationId } = params;

  const {
    email,
    summary,
    transcript,
    additionalInfo,
    locale,
    name,
    contactReason
  } = body as RequestBody;

  const publicConversationId = await prisma.conversation
    .findUnique({
      where: { id: Number(conversationId) }
    })
    .then(conversation => conversation!.public_id);

  const zendeskClient = new ZendeskClient(id, publicConversationId);
  await zendeskClient.initialize();

  const tags = ["wiselydesk"];

  if (contactReason) {
    tags.push(`wiselydesk_cr_${contactReason}`);
  }

  const ticketOptions: TicketOptions = {
    tags,
    custom_fields: [
      {
        id: 360036152652, // help center locale
        value: locale === "en" ? "hc_locale_en" : "hc_locale_de"
      }
    ]
  };

  const zendeskSupportTicket = await zendeskClient.createTicket(
    {
      email,
      summary,
      transcript,
      additionalInfo,
      locale,
      name
    },
    ticketOptions
  );

  if (zendeskSupportTicket) {
    const zendeskTicketUrl = zendeskClient.generateAgentTicketUrl(
      zendeskSupportTicket.ticket.id
    );

    // would be better to put this in cache at some point
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: Number(conversationId)
      },
      select: { livemode: true }
    });

    const isConversationLivemode = !!conversation?.livemode;

    await prisma.$transaction([
      prisma.escalation.create({
        data: {
          bot_id: parseInt(id, 10),
          conversation_id: parseInt(conversationId, 10),
          reason: contactReason || "no_reason_given",
          external_identifier: zendeskTicketUrl,
          public_conversation_id: publicConversationId,
          livemode: isConversationLivemode
        }
      }),
      prisma.conversation.update({
        where: { id: Number(conversationId) },
        data: { zendesk_ticket_url: zendeskTicketUrl, escalated: true }
      })
    ]);
  }

  return Response.json({ ticket: zendeskSupportTicket });
};
