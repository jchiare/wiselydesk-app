import prisma from "@/lib/prisma";
import { tagTickets } from "@/lib/shared/services/ticket-analysis/tag";
import { SearchZendeskTickets } from "@/lib/shared/services/zendesk/tickets";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  const clientApiKey = request.nextUrl.pathname.split("/")[5];
  const hours = request.nextUrl.pathname.split("/")[6];
  if (!clientApiKey || !hours) return new Response("Missing", { status: 400 });

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

  const zendeskSearch = new SearchZendeskTickets(
    bot.zendesk_subdomain,
    bot.zendesk_api_key,
    bot.id.toString()
  );

  const ticketSearchResults = await zendeskSearch.fetchRecentlyCreatedTickets(
    parseInt(hours, 10),
    "-tags:whats_app_en -tags:zopim_chat -ticket_form_id:360003125331 tags:amboss_en -subject:Call with"
  );
  if (ticketSearchResults.count === 0) {
    console.log("No Tickets found");
    return Response.json({ result: "No Tickets found" }, { status: 200 });
  }

  console.log(ticketSearchResults);
  const taggedTickets = await tagTickets(ticketSearchResults.results);
  if (taggedTickets.length === 0) {
    console.log("No tagged tickets");
    return new Response("No tagged tickets found", { status: 200 });
  }

  return Response.json({ success: true });
}
