import { PrismaClient } from "@prisma/client";

type ConversationAnalyticsData = {
  frequency_type: string;
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  date: string;
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
        date_format(created_at,  '%b %e') AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${sevenDaysAgo}
      GROUP BY
        4
    `;

    return conversations.map((conversation) => ({
      frequency_type: "daily",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date
    }));
  }
  async getWeeklyConvoCounts(
    botId: string,
    today: Date
  ): Promise<ConversationAnalyticsData[]> {
    const thirtyOneDaysAgo = Math.floor(
      new Date(today).setDate(today.getDate() - 31) / 1000
    );

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
      SELECT
        COUNT(id) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        CONCAT(
        DATE_FORMAT(created_at - INTERVAL (DAYOFWEEK(created_at) - 1) DAY, '%b %e'), 
        ' - ', 
        DATE_FORMAT(created_at + INTERVAL (7 - DAYOFWEEK(created_at)) DAY, '%b %e')
    )  AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${thirtyOneDaysAgo}
      GROUP BY
        4
    `;

    return conversations.map((conversation) => ({
      frequency_type: "weekly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date
    }));
  }
  async getMonthlyConvoCounts(
    botId: string,
    today: Date
  ): Promise<ConversationAnalyticsData[]> {
    const oneHundredTwentyDaysAgo = Math.floor(
      new Date(today).setDate(today.getDate() - 120) / 1000
    );

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
      SELECT
        COUNT(*) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        date_format(created_at, '%b %Y') AS date
      FROM
      conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${oneHundredTwentyDaysAgo}
      GROUP BY
      4
    `;

    return conversations.map((conversation) => ({
      frequency_type: "monthly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      date: conversation.date
    }));
  }
}
