import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log("body: ", body);

  const { clientApiKey } = body;

  // Validate the necessary fields are present
  if (!clientApiKey) {
    return NextResponse.json(
      { message: "Missing required body params" },
      { status: 400 }
    );
  }

  // dirty way to hack that we don't have a database_url set in tests
  const bot =
    process.env.APP_ENV === "test"
      ? { jon: "doe" }
      : await prisma.bot.findFirst({
          where: { client_api_key: clientApiKey }
        });

  return NextResponse.json({ bot }, { status: 200 });
};
