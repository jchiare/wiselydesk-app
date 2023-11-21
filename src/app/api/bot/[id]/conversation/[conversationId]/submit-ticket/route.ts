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
};

export const POST = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();
  const { id, conversationId } = params;

  const { email, summary, transcript, additionalInfo, locale, name } =
    body as RequestBody;

  const zendeskClient = new ZendeskClient(id, conversationId);
  await zendeskClient.initialize();

  const ticketOptions: TicketOptions = {
    tags: ["wiselydesk"],
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

    const prismaClient = new PrismaClient();
    await prismaClient.conversation.update({
      where: { id: Number(conversationId) },
      data: { zendesk_ticket_url: zendeskTicketUrl }
    });
  }

  return NextResponse.json({ ticket: zendeskSupportTicket });
};
