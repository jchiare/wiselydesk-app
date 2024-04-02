import prisma from "@/lib/prisma";

type Params = {
  params: { conversationId: string };
};

export async function POST(request: Request, { params }: Params) {
  const { conversationId } = params;

  const conversation = await prisma.conversation.update({
    where: { id: Number(conversationId) },
    data: { ended_at: new Date() }
  });

  return Response.json({ conversation }, { status: 200 });
}
