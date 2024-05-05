import prisma from "@/lib/prisma";
import { tagTickets } from "@/lib/shared/services/ticket-analysis/tag";
import { ZendeskApi } from "@/lib/shared/services/zendesk";
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

  const zendeskApiClient = new ZendeskApi(
    bot.zendesk_subdomain,
    bot.zendesk_api_key,
    bot.id.toString()
  );

  const ticketSearchResults =
    await zendeskApiClient.fetchRecentlyCreatedTickets(
      parseInt(hours, 10),
      "-tags:wiselydesk -tags:whats_app_en -description:Call from -tags:zopim_chat -ticket_form_id:360003125331 -subject:Call with"
    );
  if (ticketSearchResults.count === 0) {
    console.log("No Tickets found");
    return Response.json({ result: "No Tickets found" }, { status: 200 });
  }

  const tickets = ticketSearchResults.results;

  const userIds = tickets.map(ticket => ticket.requester_id);
  const { users } = await zendeskApiClient.fetchManyUserDetails(userIds);

  for (const ticket of tickets) {
    const user = users.find(user => user.id === ticket.requester_id);
    if (!user) continue;
    ticket.userSummary = {
      locale: user.locale,
      profession:
        user.user_fields.profession_en_ || user.user_fields.profession_de_,
      current_access:
        user.user_fields.current_access_class_en_ ||
        user.user_fields.current_access_class_de_,
      education:
        user.user_fields.university_en_ || user.user_fields.university_de_,
      examCategory: user.user_fields.next_exam_category_en_,
      examType: user.user_fields.next_exam_type_en_,
      studyObjective:
        user.user_fields.study_objective_en_ ||
        user.user_fields.study_objective_de_
    };
  }

  const taggedTickets = await tagTickets(tickets);
  if (taggedTickets.length === 0) {
    console.log("No tagged tickets");
    return new Response("No tagged tickets found", { status: 200 });
  }

  await prisma.ticketTagging.createMany({
    data: taggedTickets.map(ticket => ({
      ticket_id: ticket.id,
      tags: ticket.tags.join(", "),
      ai_generated_tags: ticket.ai_generated_tags.join(", "),
      zendesk_tags: ticket.zendesk_tags.join(", "),
      ticket_description: ticket.ticket_description,
      input_tokens: ticket.tokens.input_tokens,
      output_tokens: ticket.tokens.output_tokens,
      bot_id: ticket.bot_id,
      zendesk_url: `https://${bot.zendesk_subdomain}.zendesk.com/agent/tickets/${ticket.id}`
    })),
    skipDuplicates: true
  });

  return Response.json({ success: true });
}
