import prisma from "@/lib/prisma";
import { filterFreeAmbossTickets } from "@/lib/shared/services/ticket-analysis";
import { SearchZendeskTickets } from "@/lib/shared/services/zendesk/tickets";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("got request ", request.nextUrl);
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  console.log("after auth");

  const clientApiKey = request.nextUrl.pathname.split("/")[4];
  const hours = request.nextUrl.pathname.split("/")[5];
  if (!clientApiKey || !hours) return new Response("Missing", { status: 400 });

  const bot = await prisma.bot.findFirst({
    where: { client_api_key: clientApiKey }
  });
  if (!bot) return new Response("Missing", { status: 404 });
  console.log("bot: ", bot);

  if (!bot.zendesk_subdomain) {
    return new Response("Missing sub", { status: 400 });
  }

  if (!bot.zendesk_api_key) {
    return new Response("Missing zk", { status: 400 });
  }

  console.log("before search");
  const zendeskSearch = new SearchZendeskTickets(
    bot.zendesk_subdomain,
    bot.zendesk_api_key,
    bot.id.toString()
  );

  console.log("after search");

  const ticketSearchResults = await zendeskSearch.fetchRecentlyCreatedTickets(
    parseInt(hours, 10)
  );
  if (ticketSearchResults.count === 0) {
    console.log("No Tickets found");
    return Response.json({ result: "No Tickets found" }, { status: 200 });
  }

  console.log("tickets ..: ", ticketSearchResults);

  console.log("Tickets: ", ticketSearchResults.results.length);

  const ticketIdsAboutFreeAccess = await filterFreeAmbossTickets(
    ticketSearchResults.results
  );
  if (ticketIdsAboutFreeAccess.length === 0) {
    return new Response("No tickets about that category", { status: 200 });
  }

  console.log("Tickets about free access: ", ticketIdsAboutFreeAccess.length);
  const jobStatusUrls = await zendeskSearch.batchUpdateTicketsWithTags(
    ticketIdsAboutFreeAccess
  );
  await zendeskSearch.ensureJobsComplete(jobStatusUrls);

  return Response.json({ success: true, jobStatusUrls });
}
