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
  const { conversationId, id } = params;

  const { email, summary, transcript, additionalInfo } = body as RequestBody;

  // const zendeskClient = ZendeskClient()
  // const zendeskSupportTicket = zendeskClient.createTicket({email, summary, transcript, additionalInfo})

  // await prismaClient.conversation.update({
  // where: {
  //     public_id_bot_id: {
  //       public_id: Number(conversationId),
  //       bot_id: Number(id)
  //     }
  //   },
  //   data: {
  //     ticket_deflected: futureDeflectValue
  //   }
  // });
  // return NextResponse.json({ ticket: zendeskSupportTicket })
};
