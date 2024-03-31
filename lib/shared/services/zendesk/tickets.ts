import type { ZendeskSearchAPIResponse } from "@/types/zendesk-search";

export class SearchZendeskTickets {
  private zendeskSubdomain: string;
  private zendeskApiKey: string;
  private botId: string;
  private freeAccessTag = "wiselydesk_free_access_requests_v1";

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

  public async fetchRecentlyCreatedTickets(
    hours: number
  ): Promise<ZendeskSearchAPIResponse> {
    const timeAgo = new Date(
      new Date().getTime() - hours * 60 * 1000
    ).toISOString();
    const query = `type:ticket created>${timeAgo} NOT tags:${this.freeAccessTag}`;
    return this.search(query);
  }

  private async search(query: string): Promise<ZendeskSearchAPIResponse> {
    const zendeskApiUrl = `https://${this.zendeskSubdomain}.zendesk.com/api/v2/search.json`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${zendeskApiUrl}?query=${encodedQuery}`;

    console.log("url: ", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json"
      }
    });

    console.log(response.json());

    if (!response.ok) {
      throw new Error(`Error searching Zendesk: ${response.statusText}`);
    }

    return (await response.json()) as Promise<ZendeskSearchAPIResponse>;
  }

  public async batchUpdateTicketsWithTags(
    ticketIds: number[]
  ): Promise<string[]> {
    let jobStatuses: string[] = [];
    const chunkSize = 100; // Zendesk allows updating up to 100 tickets at a time
    for (let i = 0; i < ticketIds.length; i += chunkSize) {
      const chunk = ticketIds.slice(i, i + chunkSize);
      const ticketUpdatePayload = {
        tickets: chunk.map(id => ({
          id,
          tags: [this.freeAccessTag]
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
        .then(data => {
          console.log("Update job status:", data);
          jobStatuses.push(data.url);
        })
        .catch(error => console.error("Failed to update tickets:", error));
    }

    return jobStatuses;
  }

  public async ensureJobsComplete(jobUrls: string[]): Promise<void> {
    for (const jobUrl of jobUrls) {
      let jobCompleted = false;
      while (!jobCompleted) {
        await fetch(jobUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getAuthHeader()
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === "failed") {
              throw new Error(`Job failed with message: ${data.message}`);
            } else if (data.status === "completed") {
              console.log(`Job completed with message: ${data.message}`);
              jobCompleted = true;
            }
            // If the job is still "queued" or "working", do nothing and let the loop continue.
          })
          .catch(error => {
            console.error("Failed to get job status:", error);
            throw error;
          });

        if (!jobCompleted) {
          // Wait a bit before polling again to avoid hitting the API too hard.
          // Adjust the timeout as needed based on how frequently you want to poll.
          await new Promise(resolve => setTimeout(resolve, 50000)); // Wait for 5 seconds
        }
      }
    }
  }
}
