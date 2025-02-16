import { Analytics as AnalyticsService } from "@/lib/web/analytics";

type Params = {
  params: { id: string; conversationId: string };
};

export async function GET(request: Request, { params }: Params) {
  const botId = params.id;
  const { searchParams } = new URL(request.url);
  const frequency = searchParams.get("frequency");

  if (!frequency) {
    return Response.json({ message: "Missing frequency" }, { status: 400 });
  }

  const analyticsService = new AnalyticsService();
  const conversations = await analyticsService.getConvoCounts(botId, frequency);

  return Response.json({ data: { conversations } }, { status: 200 });
}
