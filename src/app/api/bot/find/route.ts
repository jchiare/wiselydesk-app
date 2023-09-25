import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prismaClient = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const { clientApiKey } = body;

  // Validate the necessary fields are present
  if (!clientApiKey) {
    return NextResponse.json(
      { message: "Missing required body params" },
      { status: 400 }
    );
  }

  console.log(process.env.APP_ENV);

  // const bot = await prismaClient.bot.findFirst({
  //   where: { client_api_key: clientApiKey }
  // });

  const bot = { john: "deo" };

  return NextResponse.json({ bot }, { status: 200 });
};
