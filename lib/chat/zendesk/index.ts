import { PrismaClient } from "@prisma/client";
import renderMessage from "@/lib/shared/services/render-message";
import type { ZendeskTicket } from "@/types/zendesk-ticket";

export type TicketOptions = {
  priority?: string;
  tags?: string[];
  custom_fields?: any[];
};

type CreateTicketData = {
  email: string;
  summary: string;
  transcript: string;
  additionalInfo: string;
  locale: string;
  name: string;
};

export class ZendeskClient {
  private botId: string;
  private conversationId: number;
  private apiToken?: string;
  private subdomain?: string;
  private prismaClient: PrismaClient;

  constructor(botId: string, conversationId: number, prisma?: PrismaClient) {
    this.botId = botId;
    this.conversationId = conversationId;
    this.prismaClient = prisma ?? new PrismaClient();
  }
  public async initialize(): Promise<void> {
    await this.setApiTokenAndSubdomain();
  }

  private async setApiTokenAndSubdomain(): Promise<void> {
    const bot = await this.prismaClient.bot.findUnique({
      where: { id: Number(this.botId) }
    });

    if (!bot || !bot.zendesk_api_key || !bot.zendesk_subdomain) {
      throw new Error(`Invalid bot configuration for id: ${this.botId}`);
    }

    this.apiToken = bot.zendesk_api_key;
    this.subdomain = bot.zendesk_subdomain;
  }

  private createTicketObject(data: CreateTicketData, options?: TicketOptions) {
    return {
      requester: {
        email: data.email,
        name: data.name
      },
      subject:
        data.locale === "de" ? `Deine Support-Anfrage` : "Your Support Request",
      comment: {
        public: false,
        html_body: [
          `<h3>Ticket created from a WiselyDesk chat</h3> ${this.generateWiselyDeskConvoUrl()}`,
          `<h3>Additional Information: </h3> ${data.additionalInfo}`,
          `<h3>Transcript: </h3> ${this.formatTranscript(data.transcript)}
          `
        ].join("<br><br>")
      },
      ...options
    };
  }

  public async createTicket(
    data: CreateTicketData,
    options?: TicketOptions
  ): Promise<ZendeskTicket | undefined> {
    const ticket = this.createTicketObject(data, options);
    const url = `https://${this.subdomain}.zendesk.com/api/v2/tickets.json`;
    // todo fix at some point ..
    const username =
      process.env.NODE_ENV === "development"
        ? "jay.gch93+daspu@gmail.com/token"
        : "jay@wiselydesk.com/token";
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
        const responseData = (await response.json()) as ZendeskTicket;
        return responseData;
      } else {
        throw new Error(`Failed to create ticket: ${await response.text()}`);
      }
    } catch (error) {
      throw new Error(`Failed to create ticket: ${error}`);
    }
  }

  public generateAgentTicketUrl(ticketId: number): string {
    if (!this.subdomain) {
      throw new Error("Subdomain is not initialized");
    }
    return `https://${this.subdomain}.zendesk.com/agent/tickets/${ticketId}`;
  }

  private formatTranscript(transcript: string): string | null {
    let markdownTranscript = renderMessage(transcript);

    if (!markdownTranscript) return markdownTranscript;

    markdownTranscript = markdownTranscript.replaceAll(
      "- User Message:",
      "<strong>- User Message:</strong>"
    );

    // Start with a newline since we expect it to be second
    markdownTranscript = markdownTranscript.replaceAll(
      "- Bot Message:",
      "<br> <strong>- Bot Message:</strong>"
    );

    return markdownTranscript;
  }

  private generateWiselyDeskConvoUrl(): string {
    return `<a target="_blank" href="https://apps.wiselydesk.com/bot/${this.botId}/conversation/${this.conversationId}">Link to WiselyDesk conversation</a>`;
  }
}
