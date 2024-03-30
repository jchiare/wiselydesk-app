import type { ZendeskTicket } from "@/types/zendesk-ticket";

export class ZendeskTicketFetcher {
  private zendeskSubdomain: string;
  private zendeskApiKey: string;

  constructor(zendeskSubdomain: string, zendeskApiKey: string) {
    this.zendeskSubdomain = zendeskSubdomain;
    this.zendeskApiKey = zendeskApiKey;
  }

  private getAuthHeader(): string {
    return `Basic ${btoa(`${this.zendeskApiKey}/token`)}`;
  }

  public async fetchTicketsCreatedInLast(
    hours: number
  ): Promise<ZendeskTicket[]> {
    const zendeskApiUrl = `https://${this.zendeskSubdomain}.zendesk.com/api/v2/tickets.json`;
    const timeAgo = new Date(
      new Date().getTime() - hours * 60 * 60 * 1000
    ).toISOString();

    const response = await fetch(zendeskApiUrl + `?created>=${timeAgo}`, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching tickets: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tickets;
  }
}

// // Example usage
// (async () => {
//   try {
//     const zendeskSubdomain = "yourZendeskSubdomain";
//     const zendeskApiKey = "yourZendeskApiKey";
//     const ticketFetcher = new ZendeskTicketFetcher(
//       zendeskSubdomain,
//       zendeskApiKey
//     );

//     const tickets = await ticketFetcher.fetchTicketsCreatedInLast(1.5);
//     console.log("Zendesk Tickets:", tickets);
//   } catch (error) {
//     console.error("Failed to fetch Zendesk tickets:", error);
//   }
// })();
