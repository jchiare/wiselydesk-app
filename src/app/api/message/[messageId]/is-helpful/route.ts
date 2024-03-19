import prisma from "@/lib/prisma";

type ParamsType = {
  params: { messageId: string };
};

export async function PUT(req: Request, { params }: ParamsType) {
  const { messageId } = params;
  const body = await req.json();
  const isHelpful = body.isHelpful;

  if (isHelpful === undefined) {
    return new Response(
      JSON.stringify({ error: "isHelpful must be provided." }),
      { status: 400 }
    );
  }

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: parseInt(messageId, 10) },
      data: { is_helpful: isHelpful }
    });

    await prisma.conversation.update({
      where: { id: updatedMessage.conversation_id },
      data: { rating: isHelpful }
    });

    return Response.json({ message: updatedMessage });
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma's "Record to update not found." error
      return new Response(JSON.stringify({ error: "Message not found." }), {
        status: 404
      });
    }
    console.error("Error updating message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}
