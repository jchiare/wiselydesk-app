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

    if (!bot || !bot.zendesk_api_key || !bot.zendesk_subdomain) {
      throw new Error(`Invalid bot configuration for id: ${this.botId}`);
    }

    this.apiToken = bot.zendesk_api_key;
    this.subdomain = bot.zendesk_subdomain;
  }

  private createTicketObject(data: CreateTicketData, options?: TicketOptions) {
    return {
      requester: {
        email: data.email
      },
      subject: `WiselyDesk Chat: ${data.summary.slice(0, 45)}`,
      comment: {
        public: false,
        html_body: [
          ` ------ Transcript Start ------ 
          ${this.formatTranscript(data.transcript)}
            ------ Transcript End ------ 
          `,
          `Additional Information: ${data.additionalInfo}`
        ].join("<br>")
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

    console.log("Creating ticket:", ticket);

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

  private formatTranscript(transcript: string): string {
    // Replace <NEWLINE> placeholders with actual newline characters
    const formattedTranscript = transcript.replace(/<NEWLINE>/g, "<br>");

    // Split the transcript by lines to separate user and bot messages
    const lines = formattedTranscript.split("<br>");

    let markdownTranscript = "<br>";

    lines.forEach((line) => {
      if (line.includes("- User Message:")) {
        markdownTranscript += `<strong>- User Message:</strong>  ${line
          .replace("- User Message:", "")
          .trim()} <br> `;
      }

      if (line.includes("- Bot Message:")) {
        markdownTranscript += `<strong>- Bot Message:</strong>  ${line
          .replace("- Bot Message:", "")
          .trim()} <br> `;
      }
    });

    return markdownTranscript;
  }
}
