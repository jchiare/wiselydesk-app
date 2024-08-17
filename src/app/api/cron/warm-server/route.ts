import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  let successful = true;
  const startTime = Date.now();
  try {
    const response = await fetch(
      `https://apps.wiselydesk.com/widget/12345ApiKey?widgetOpen=true&randomTime=${startTime}`
    );
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Fetch completed in ${duration}ms`);
    if (!response.ok) {
      successful = false;
      console.error(`Fetch failed with status ${response.status})`);
    }
  } catch (error) {
    console.error("Error fetching the URL:", error);
    successful = false;
  }

  return Response.json({ successful });
}
