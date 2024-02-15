import { ZendeskClient, type TicketOptions } from "@/lib/chat/zendesk";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

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
  contactReason: string | null;
};

export const POST = async (request: NextRequest, { params }: Params) => {
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

  const prismaClient = new PrismaClient();

  const publicConversationId = await prismaClient.conversation
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
    console.log(zendeskSupportTicket.ticket);
    const zendeskTicketUrl = zendeskClient.generateAgentTicketUrl(
      zendeskSupportTicket.ticket.id
    );

    await prismaClient.conversation.update({
      where: { id: Number(conversationId) },
      data: { zendesk_ticket_url: zendeskTicketUrl }
    });
  }

  return NextResponse.json({ ticket: zendeskSupportTicket });
};
