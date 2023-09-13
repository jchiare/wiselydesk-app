import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prismaClient = new PrismaClient();

type Params = {
  params: { id: string; conversationId: string };
};

export const PATCH = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();
  const { conversationId, id } = params;

  const { futureDeflectValue } = body;

  // Validate the necessary fields are present
  if (!conversationId || futureDeflectValue === undefined) {
    return NextResponse.json(
      { message: "conversation_id and futureDeflectValue are required" },
      { status: 400 }
    );
  }

  console.log("public_id:", Number(conversationId));
  console.log("bot id: ", Number(id));
  try {
    const updatedConversation = await prismaClient.conversation.update({
      where: {
        public_id_bot_id: {
          public_id: Number(conversationId),
          bot_id: Number(id)
        }
      },
      data: {
        ticket_deflected: futureDeflectValue
      }
    });

    return NextResponse.json(
      { conversation: updatedConversation },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 501 }
    );
  }
};
