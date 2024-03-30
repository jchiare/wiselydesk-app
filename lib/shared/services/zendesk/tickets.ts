import type { ZendeskSearchAPIResponse } from "@/types/zendesk-search";

export class SearchZendeskTickets {
  private zendeskSubdomain: string;
  private zendeskApiKey: string;
  private botId: string;

  constructor(zendeskSubdomain: string, zendeskApiKey: string, botId: string) {
    this.zendeskSubdomain = zendeskSubdomain;
    this.zendeskApiKey = zendeskApiKey;
    this.botId = botId;
  }

  private getUsername(): string {
    if (this.botId === "1") {
      return "jay.gch93+daspu@gmail.com/token";
    }
    return process.env.NODE_ENV === "development"
      ? "jay.gch93+daspu@gmail.com/token"
      : "jay@wiselydesk.com/token";
  }

  private getAuthHeader(): string {
    const username = this.getUsername();
    const base64Credentials = btoa(`${username}:${this.zendeskApiKey}`);
    return `Basic ${base64Credentials}`;
  }

  public async fetchRecentlyCreatedTickets(): Promise<ZendeskSearchAPIResponse> {
    // Construct the query to fetch tickets created in the last 1.25 hours
    const timeAgo = new Date(
      new Date().getTime() - 75 * 60 * 1000
    ).toISOString();
    const query = `type:ticket created>${timeAgo}`;
    return this.search(query);
  }

  private async search(query: string): Promise<ZendeskSearchAPIResponse> {
    const zendeskApiUrl = `https://${this.zendeskSubdomain}.zendesk.com/api/v2/search.json`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${zendeskApiUrl}?query=${encodedQuery}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error searching Zendesk: ${response.statusText}`);
    }

    return (await response.json()) as Promise<ZendeskSearchAPIResponse>;
  }

  public async updateTicketsWithTags(ticketIds: number[]): Promise<void> {
    const chunkSize = 100; // Zendesk allows updating up to 100 tickets at a time
    for (let i = 0; i < ticketIds.length; i += chunkSize) {
      const chunk = ticketIds.slice(i, i + chunkSize);
      const ticketUpdatePayload = {
        tickets: chunk.map(id => ({
          id,
          tags: ["wiselydesk_free_access_requests_v1"]
        }))
      };

      await fetch(
        `https://${this.zendeskSubdomain}.zendesk.com/api/v2/tickets/update_many.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getAuthHeader()
          },
          body: JSON.stringify(ticketUpdatePayload)
        }
      )
        .then(response => response.json())
        .then(data => console.log("Update job status:", data))
        .catch(error => console.error("Failed to update tickets:", error));
    }
  }
}
