import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type Params = {
  params: { id: string; conversationId: string };
};

export const PATCH = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();
  const { conversationId, id } = params;

  const { futureReviewValue } = body;

  // Validate the necessary fields are present
  if (!conversationId || futureReviewValue === undefined) {
    return NextResponse.json(
      { message: "conversation_id and futureReviewValue are required" },
      { status: 400 }
    );
  }
  try {
    const updatedConversation = await prisma.conversation.update({
      where: {
        public_id_bot_id: {
          public_id: Number(conversationId),
          bot_id: Number(id)
        }
      },
      data: {
        to_review: futureReviewValue
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
