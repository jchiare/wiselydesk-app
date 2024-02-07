import { PrismaClient } from "@prisma/client";

type ConversationAnalyticsData = {
  frequency_type: string;
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  date: string;
  format: string;
};

type RawConversationData = {
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  date: string;
};

export class Analytics {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getConvoCounts(
    botId: string,
    frequency: string,
    viewingType: string
  ): Promise<ConversationAnalyticsData[]> {
    switch (frequency) {
      case "daily":
        return this.getDailyConvoCounts(botId, new Date());
      case "weekly":
        return this.getWeeklyConvoCounts(botId, new Date());
      case "monthly":
        return this.getMonthlyConvoCounts(botId, new Date());
      default:
        throw new Error("Invalid frequency");
    }
  }

  async getDailyConvoCounts(
    botId: string,
    today: Date
  ): Promise<ConversationAnalyticsData[]> {
    const sevenDaysAgo = Math.floor(
      new Date(today).setDate(today.getDate() - 7) / 1000
    );

    const conversations: RawConversationData[] = await this.prisma.$queryRaw`
      SELECT
        COUNT(id) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        date_format(created_at, '%d-%m-%Y') AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${sevenDaysAgo}
      GROUP BY
        date_format(created_at, '%d-%m-%Y')
    `;

    return conversations.map((conversation) => ({
      frequency_type: "daily",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date,
      format: "DD-MM-YYYY"
    }));
  }
  async getWeeklyConvoCounts(
    botId: string,
    today: Date
  ): Promise<ConversationAnalyticsData[]> {
    const thirtyOneDaysAgo = new Date(today).setDate(today.getDate() - 31);

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
      SELECT
        COUNT(*) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        CONCAT('Week ', WEEK(created_at, 3), '-', YEAR(created_at)) AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        created_at >= ${thirtyOneDaysAgo}
      GROUP BY
        YEAR(created_at), WEEK(created_at, 3)
    `;

    return conversations.map((conversation) => ({
      frequency_type: "weekly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date,
      format: "Week Number-Year"
    }));
  }
  async getMonthlyConvoCounts(
    botId: string,
    today: Date
  ): Promise<ConversationAnalyticsData[]> {
    const oneHundredTwentyDaysAgo = new Date(today);
    oneHundredTwentyDaysAgo.setDate(today.getDate() - 120);

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
      SELECT
        COUNT(*) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        date_format(created_at, 'MM-YYYY') AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        created_at >= ${oneHundredTwentyDaysAgo}
      GROUP BY
      date_format(created_at, 'MM-YYYY')
    `;

    return conversations.map((conversation) => ({
      frequency_type: "monthly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date,
      format: "MM-YYYY"
    }));
  }
}
