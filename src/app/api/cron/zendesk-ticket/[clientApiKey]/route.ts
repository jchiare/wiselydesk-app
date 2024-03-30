import prisma from "@/lib/prisma";
import { filterFreeAmbossTickets } from "@/lib/shared/services/ticket-analysis";
import { SearchZendeskTickets } from "@/lib/shared/services/zendesk/tickets";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  const clientApiKey = request.nextUrl.pathname.split("/")[4];
  if (!clientApiKey) return new Response("Missing", { status: 400 });

  const bot = await prisma.bot.findFirst({
    where: { client_api_key: clientApiKey }
  });
  if (!bot) return new Response("Missing", { status: 404 });

  if (!bot.zendesk_subdomain) {
    return new Response("Missing sub", { status: 400 });
  }

  if (!bot.zendesk_api_key) {
    return new Response("Missing zk", { status: 400 });
  }

  // Fetch tickets created in the last 1.25 hours
  const zendeskSearch = new SearchZendeskTickets(
    bot.zendesk_subdomain,
    bot.zendesk_api_key
  );

  const tickets = await zendeskSearch.fetchRecentlyCreatedTickets();
  if (tickets.count === 0) {
    return new Response("No tickets", { status: 200 });
  }

  const ticketIdsAboutFreeAccess = await filterFreeAmbossTickets(
    tickets.results
  );

  if (ticketIdsAboutFreeAccess.length === 0) {
    return new Response("No tickets about that category", { status: 200 });
  }

  await zendeskSearch.updateTicketsWithTags(ticketIdsAboutFreeAccess);

  return Response.json({ success: true });
}
