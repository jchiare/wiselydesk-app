import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prismaClient = new PrismaClient();

type Params = {
  params: { id: string };
};

export const PATCH = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();
  const conversation_id = params.id;

  const { futureDeflectValue } = body;

  // Validate the necessary fields are present
  if (!conversation_id || futureDeflectValue === undefined) {
    return NextResponse.json(
      { message: "conversation_id and futureDeflectValue are required" },
      { status: 400 }
    );
  }

  console.log("public_id:", Number(conversation_id));
  console.log("bot id: ", Number(params.id));
  try {
    const updatedConversation = await prismaClient.conversation.update({
      where: {
        public_id_bot_id: {
          public_id: Number(conversation_id),
          bot_id: Number(params.id)
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
