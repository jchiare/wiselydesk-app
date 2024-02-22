import { PrismaClient } from "@prisma/client";

export type ConversationAnalyticsData = {
  frequency_type: string;
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  positive_count: number;
  negative_count: number;
  date: string;
};

type RawConversationData = {
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  date: string;
  negative_count: number;
  positive_count: number;
};

export class Analytics {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getConvoCounts(
    botId: string,
    frequency: string
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

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
   SELECT
    COUNT(id) AS total_convo_count,
    SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
    SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
    date,
    SUM(CASE WHEN rating = 'Positive' THEN 1 ELSE 0 END) AS positive_count,
    SUM(CASE WHEN rating = 'Negative' THEN 1 ELSE 0 END) AS negative_count
  FROM
  (
    SELECT
      c.id,
      c.ticket_deflected,
      c.zendesk_ticket_url,
      date_format(c.created_at, '%b %e') AS date,
      CASE
        WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) > SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Positive'
        WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) < SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Negative'
        ELSE 'Neutral'
      END AS rating,
      c.bot_id bot_id,
      c.created_at created_at
    FROM
      message m
      JOIN conversation c ON m.conversation_id = c.id
    WHERE
      m.bot_id = ${botId} AND
      UNIX_TIMESTAMP(m.created_at) >= ${sevenDaysAgo} AND
      c.livemode = 1
    GROUP BY
      c.id, 4
  ) AS conversation
  WHERE
    bot_id = ${botId} AND
    UNIX_TIMESTAMP(created_at) >= ${sevenDaysAgo}
  GROUP BY
    date;
    `;

    return conversations.map(conversation => ({
      frequency_type: "daily",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      positive_count: Number(conversation.positive_count),
      negative_count: Number(conversation.negative_count),
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
        )  AS date,
        SUM(CASE WHEN rating = 'Positive' THEN 1 ELSE 0 END) AS positive_count,
        SUM(CASE WHEN rating = 'Negative' THEN 1 ELSE 0 END) AS negative_count
      FROM
        (
      SELECT
        c.id,
        c.ticket_deflected,
        c.zendesk_ticket_url,
        date_format(c.created_at, '%b %e') AS date,
        CASE
          WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) > SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Positive'
          WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) < SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Negative'
          ELSE 'Neutral'
        END AS rating,
        c.bot_id bot_id,
        c.created_at created_at
      FROM
        message m
        JOIN conversation c ON m.conversation_id = c.id
      WHERE
        m.bot_id = ${botId} AND
        UNIX_TIMESTAMP(m.created_at) >= ${thirtyOneDaysAgo} AND
        c.livemode = 1
      GROUP BY
        c.id, 4
    ) AS conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${thirtyOneDaysAgo}
      GROUP BY
        4
    `;

    return conversations.map(conversation => ({
      frequency_type: "weekly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      positive_count: Number(conversation.positive_count),
      negative_count: Number(conversation.negative_count),
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
        date_format(created_at, '%b %Y') AS date,
        SUM(CASE WHEN rating = 'Positive' THEN 1 ELSE 0 END) AS positive_count,
        SUM(CASE WHEN rating = 'Negative' THEN 1 ELSE 0 END) AS negative_count
      FROM
      (
      SELECT
        c.id,
        c.ticket_deflected,
        c.zendesk_ticket_url,
        date_format(c.created_at, '%b %e') AS date,
        CASE
          WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) > SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Positive'
          WHEN SUM(CASE WHEN m.is_helpful = 1 THEN 1 ELSE 0 END) < SUM(CASE WHEN m.is_helpful = 0 THEN 1 ELSE 0 END) THEN 'Negative'
          ELSE 'Neutral'
        END AS rating,
        c.bot_id bot_id,
        c.created_at created_at
      FROM
        message m
        JOIN conversation c ON m.conversation_id = c.id
      WHERE
        m.bot_id = ${botId} AND
        UNIX_TIMESTAMP(m.created_at) >= ${oneHundredTwentyDaysAgo} AND
        c.livemode = 1
      GROUP BY
        c.id, 4
    ) AS conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${oneHundredTwentyDaysAgo}
      GROUP BY
      4
    `;

    return conversations.map(conversation => ({
      frequency_type: "monthly",
      total_convo_count: Number(conversation.total_convo_count),
      deflected_convo_count: Number(conversation.deflected_convo_count),
      ticket_created_count: Number(conversation.ticket_created_count),
      positive_count: Number(conversation.positive_count),
      negative_count: Number(conversation.negative_count),
      date: conversation.date
    }));
  }
}
