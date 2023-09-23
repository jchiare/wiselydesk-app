import { ZendeskClient, type TicketOptions } from "@/lib/chat/zendesk";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prismaClient = new PrismaClient();

type Params = {
  params: { id: string; conversationId: string };
};

type RequestBody = {
  email: string;
  summary: string;
  transcript: string;
  additionalInfo: string;
};

export const POST = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();
  const { id } = params;

  const { email, summary, transcript, additionalInfo } = body as RequestBody;

  const zendeskClient = new ZendeskClient(id);
  zendeskClient.initialize();

  const ticketOptions: TicketOptions = {
    priority: "high",
    tags: ["app_issue", "urgent"]
  };

  const zendeskSupportTicket = zendeskClient.createTicket(
    {
      email,
      summary,
      transcript,
      additionalInfo
    },
    ticketOptions
  );

  return NextResponse.json({ ticket: zendeskSupportTicket });
};
