import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

type Params = {
  params: { id: string; conversationId: string };
};

export async function GET(request: Request, { params }: Params) {
  const botId = params.id;
  const { searchParams } = new URL(request.url);
  const frequency = searchParams.get("frequency");
  const viewingType = searchParams.get("viewingType");

  if (!frequency) {
    return Response.json({ message: "Missing frequency" }, { status: 400 });
  }

  if (!viewingType) {
    return Response.json({ message: "Missing viewingType" }, { status: 400 });
  }

  const notes = await prismaClient.note.findMany({
    where: {
      conversation_id: Number(conversationId)
    }
  });

  return Response.json({ notes }, { status: 200 });
}
