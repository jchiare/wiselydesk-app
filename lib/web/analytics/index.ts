import prisma from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import {
  startOfYear,
  addWeeks,
  startOfWeek,
  endOfWeek,
  format
} from "date-fns";

export type ConversationAnalyticsData = {
  frequency_type: string;
  total_convo_count: number;
  deflected_convo_count: number;
  ticket_created_count: number;
  positive_count: number;
  negative_count: number;
  date: string;
};

export type EscalationAnalyticsData = {
  frequency_type: string;
  date: string;
  count: number;
  reason: string;
};

type RawEscalationData = Omit<EscalationAnalyticsData, "frequency_type">;

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
    this.prisma = prisma;
  }

  async getEscalationCounts(botId: string, frequency: string) {
    switch (frequency) {
      case "daily":
        return this.getDailyEscalationCounts(botId, new Date());
      case "weekly":
        return this.getWeeklyEscalationCounts(botId, new Date());
      case "monthly":
        return this.getMonthlyEscalationCounts(botId, new Date());
      default:
        throw new Error("Invalid frequency");
    }
  }

  async getDailyEscalationCounts(
    botId: string,
    today: Date
  ): Promise<EscalationAnalyticsData[]> {
    const sevenDaysAgo = Math.floor(
      new Date(today).setDate(today.getDate() - 7) / 1000
    );

    const escalations = await this.prisma.$queryRaw<RawEscalationData[]>`
        select 
          reason, 
          date_format(created_at, '%b %e') AS date, 
          count(id) "count" 
        from escalation 
        where 
          bot_id = ${botId} AND
          UNIX_TIMESTAMP(created_at) >= ${sevenDaysAgo} and
          livemode = 1
        group by 
          1, 2;
    `;

    return escalations.map(escalation => ({
      frequency_type: "daily",
      count: Number(escalation.count),
      reason: escalation.reason,
      date: escalation.date
    }));
  }
  async getWeeklyEscalationCounts(
    botId: string,
    today: Date
  ): Promise<EscalationAnalyticsData[]> {
    const jan1st2024 = Math.floor(
      new Date("2024-01-01T00:00:00Z").getTime() / 1000
    );

    const escalations = await this.prisma.$queryRaw<RawEscalationData[]>`
    SELECT 
        count(id) "count",
        reason,
        YEARWEEK(created_at, 5) AS date
    FROM 
        escalation 
    WHERE 
      bot_id = ${botId} AND
      UNIX_TIMESTAMP(created_at) >= ${jan1st2024} and
      livemode = 1
    GROUP BY
      2, 3;
      `;

    return escalations.map(escalation => ({
      frequency_type: "weekly",
      count: Number(escalation.count),
      reason: escalation.reason,
      date: getStartAndEndOfWeek(escalation.date)
    }));
  }
  async getMonthlyEscalationCounts(
    botId: string,
    today: Date
  ): Promise<EscalationAnalyticsData[]> {
    const nov152023 = Math.floor(
      new Date("2023-11-15T00:00:00Z").getTime() / 1000
    );

    const escalations = await this.prisma.$queryRaw<RawEscalationData[]>`
        select 
          reason, 
          date_format(created_at, '%b %Y') AS date, 
          count(id) "count" 
        from escalation 
        where 
          bot_id = ${botId} AND
          UNIX_TIMESTAMP(created_at) >= ${nov152023} and
          livemode = 1
        group by 
          1, 2;
    `;

    return escalations.map(escalation => ({
      frequency_type: "daily",
      count: Number(escalation.count),
      reason: escalation.reason,
      date: escalation.date
    }));
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
    const jan1st2024 = Math.floor(
      new Date("2024-01-01T00:00:00Z").getTime() / 1000
    );

    const conversations = await this.prisma.$queryRaw<RawConversationData[]>`
      SELECT
        COUNT(id) AS total_convo_count,
        SUM(CASE WHEN ticket_deflected = TRUE THEN 1 ELSE 0 END) AS deflected_convo_count,
        SUM(CASE WHEN zendesk_ticket_url IS NOT NULL THEN 1 ELSE 0 END) AS ticket_created_count,
        YEARWEEK(created_at, 5) AS week_number,
        CONCAT(DATE_FORMAT(MIN(DATE_FORMAT(created_at, '%Y-%m-%d')), '%b %e'), ' - ',
  		    DATE_FORMAT(MAX(DATE_FORMAT(created_at, '%Y-%m-%d')), '%b %e')) as date,
        SUM(CASE WHEN rating = 'Positive' THEN 1 ELSE 0 END) AS positive_count,
        SUM(CASE WHEN rating = 'Negative' THEN 1 ELSE 0 END) AS negative_count
      FROM
        (
      SELECT
        c.id,
        c.ticket_deflected,
        c.zendesk_ticket_url,
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
        UNIX_TIMESTAMP(m.created_at) >= ${jan1st2024} AND
        c.livemode = 1
      GROUP BY
        c.id
    ) AS conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${jan1st2024}
      GROUP BY
      week_number
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
    const jan1st2024 = Math.floor(
      new Date("2024-01-01T00:00:00Z").getTime() / 1000
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
        UNIX_TIMESTAMP(m.created_at) >= ${jan1st2024} AND
        c.livemode = 1
      GROUP BY
        c.id, 4
    ) AS conversation
      WHERE
        bot_id = ${botId} AND
        UNIX_TIMESTAMP(created_at) >= ${jan1st2024}
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

function getStartAndEndOfWeek(yearWeekNumber: string) {
  const year = parseInt(`${yearWeekNumber}`.slice(0, 4), 10);
  const weekNumber = parseInt(`${yearWeekNumber}`.slice(4, 6), 10);

  const firstDayOfYear = startOfYear(new Date(year, 0));

  const weekStartDate = addWeeks(firstDayOfYear, weekNumber - 1);

  const startOfWeekDate = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });

  const formattedStartOfWeekDate = format(startOfWeekDate, "MMM dd");
  const formattedEndOfWeekDate = format(endOfWeekDate, "MMM dd");

  return `${formattedStartOfWeekDate} - ${formattedEndOfWeekDate}`;
}
