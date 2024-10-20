import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  const clientApiKey = request.nextUrl.pathname.split("/")[4];

  if (!clientApiKey) return new Response("Missing", { status: 400 });

  let bot =
    process.env.NODE_ENV === "development"
      ? { id: 2 }
      : await prisma.bot.findFirst({
          where: { client_api_key: clientApiKey }
        });

  if (!bot) return new Response("Missing", { status: 404 });

  const deleteResult = await prisma.chatTagging.deleteMany({
    where: {
      bot_id: bot.id
    }
  });

  console.log(`Deleted ${deleteResult.count} chats`);

  return Response.json({
    deletedChatsCount: deleteResult.count
  });
}
