import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prismaClient = new PrismaClient();

type Params = {
  params: { id: string; conversationId: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  // Get conversation_id from the query params
  const conversationId = params.id;

  if (!conversationId) {
    return NextResponse.json(
      { message: "Missing conversation_id" },
      { status: 400 }
    );
  }

  const notes = await prismaClient.note.findMany({
    where: {
      conversation_id: Number(conversationId)
    }
  });

  return NextResponse.json({ notes }, { status: 200 });
}

export const POST = async (request: NextRequest, { params }: Params) => {
  const body = await request.json();

  const { content, userId, conversationId } = body;

  // Validate the necessary fields are present
  if (!content || !conversationId || !userId) {
    return NextResponse.json(
      { message: "content and conversation_id and userId are required" },
      { status: 400 }
    );
  }

  const newNote = await prismaClient.note.create({
    data: {
      user_id: userId,
      content,
      conversation_id: Number(conversationId)
    }
  });

  return NextResponse.json({ note: newNote }, { status: 201 });
};
