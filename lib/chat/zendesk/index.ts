import { PrismaClient } from "@prisma/client";

export interface TicketOptions {
  priority?: string;
  tags?: string[];
}

interface CreateTicketData {
  email: string;
  summary: string;
  transcript: string;
  additionalInfo: string;
}

export class ZendeskClient {
  w;
  private botId: string;
  private apiToken?: string;
  private subdomain?: string;
  private prismaClient: PrismaClient;

  constructor(botId: string, prisma?: PrismaClient) {
    this.botId = botId;
    this.prismaClient = prisma ?? new PrismaClient();
  }
  public async initialize(): Promise<void> {
    await this.setApiTokenAndSubdomain();
  }

  private async setApiTokenAndSubdomain(): Promise<void> {
    const bot = await this.prismaClient.bot.findUnique({
      where: { id: Number(this.botId) }
    });

    if (!bot || !bot.client_api_key || !bot.zendesk_subdomain) {
      throw new Error(`Invalid bot configuration for id: ${this.botId}`);
    }

    this.apiToken = bot.client_api_key;
    this.subdomain = bot.zendesk_subdomain;
  }

  private createTicketObject(data: CreateTicketData, options?: TicketOptions) {
    return {
      requester: {
        email: data.email
      },
      subject: `WiselyDesk Chat: ${data.summary}`,
      comment: {
        body: [
          `Transcript: ${data.transcript}`,
          `Additional Information: ${data.additionalInfo}`
        ].join("\n")
      },
      ...options
    };
  }

  public async createTicket(
    data: CreateTicketData,
    options?: TicketOptions
  ): Promise<void> {
    const ticket = this.createTicketObject(data, options);
    const url = `https://${this.subdomain}.zendesk.com/api/v2/tickets.json`;
    // todo fix at some point ..
    const username =
      process.env.NODE_ENV === "development"
        ? "jay.gch93+daspu@gmail.com/token"
        : "jay@wiselydesk.com";
    const base64Credentials = btoa(`${username}:${this.apiToken}`);

    const headers = new Headers({
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/json"
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ ticket })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Ticket created:", responseData);
      } else {
        console.log("Failed to create ticket:", await response.text());
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  }
}
