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
  private conversationId: string;
  private apiToken?: string;
  private subdomain?: string;
  private prismaClient: PrismaClient;

  constructor(botId: string, conversationId: string, prisma?: PrismaClient) {
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
        data.locale === "de"
          ? `DE: Deine Support-Anfrage`
          : "EN: Your Support Request",
      comment: {
        public: false,
        html_body: [
          `<h3>Ticket created from a WiselyDesk chat</h3> ${this.generateWiselyDeskConvoUrl()}`,
          `<h3>AI Summary: </h3> ${this.formatSummary(data.summary)}`,
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
        const responseData = await response.json();
        return responseData as ZendeskTicket;
      } else {
        console.log("Failed to create ticket:", await response.text());
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  }

  public generateAgentTicketUrl(ticketId: number): string {
    if (!this.subdomain) {
      throw new Error("Subdomain is not initialized");
    }
    return `https://${this.subdomain}.zendesk.com/agent/tickets/${ticketId}`;
  }

  private formatSummary(summary: string): string {
    // Split the text into lines based on the hyphen and space "- ".
    const lines = summary.split("- ");

    // Filter lines that start with a hyphen and join them with <br>.
    const formattedLines = lines.map((line) => line.trim()).join("<br> - ");

    return formattedLines;
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
