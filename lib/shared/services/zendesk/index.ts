import type { ZendeskSearchAPIResponse } from "@/types/zendesk-search";
import type { ZendeskUserDetails } from "@/types/zendesk-user";

export class ZendeskApi {
  private zendeskSubdomain: string;
  private zendeskApiKey: string;
  private botId: string;
  public freeAccessTag = "wiselydesk_free_access_requests_v1";

  constructor(zendeskSubdomain: string, zendeskApiKey: string, botId: string) {
    this.zendeskSubdomain = zendeskSubdomain;
    this.zendeskApiKey = zendeskApiKey;
    this.botId = botId;
  }

  private getUsername(): string {
    if (this.botId === "1") {
      return "jay.gch93+daspu@gmail.com/token";
    }
    return "jay@wiselydesk.com/token";
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
    hours: number,
    queryEnding?: string
  ): Promise<ZendeskSearchAPIResponse> {
    const timeAgo = `${hours}hour`;
    let query = `type:ticket created>${timeAgo}`;
    if (queryEnding) {
      query += ` ${queryEnding}`;
    }
    return this.search(query);
  }

  private async search(query: string): Promise<ZendeskSearchAPIResponse> {
    const zendeskApiUrl = `https://${this.zendeskSubdomain}.zendesk.com/api/v2/search.json`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${zendeskApiUrl}?query=${encodedQuery}`;
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .catch(error => {
        throw new Error("Failed to search tickets:", error);
      });

    return response as Promise<ZendeskSearchAPIResponse>;
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
        .then(data => jobStatuses.push(data.job_status.url))
        .catch(error => console.error("Failed to update tickets:", error));
    }

    return jobStatuses;
  }

  public async ensureJobsComplete(jobUrls: string[]): Promise<void> {
    for (const jobUrl of jobUrls) {
      let jobCompleted = false;
      while (!jobCompleted) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

        console.log("Polling job status on url: ", jobUrl);
        await fetch(jobUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getAuthHeader()
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.job_status.status === "failed") {
              throw new Error(`Job failed with message: ${data.message}`);
            } else if (data.job_status.status === "completed") {
              jobCompleted = true;
            }
            // If the job is still "queued" or "working", do nothing and let the loop continue.
          })
          .catch(error => {
            throw new Error(
              `Failed to get job status on url ${jobUrl} with error: `,
              error
            );
          });
      }
    }
  }
  public async fetchManyUserDetails(
    userIds: number[]
  ): Promise<ZendeskUserDetails> {
    const url = `https://${
      this.zendeskSubdomain
    }.zendesk.com/api/v2/users/show_many.json?ids=${userIds.join(",")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user details for user IDs: ${userIds}`);
    }

    const data = await response.json();
    return data as ZendeskUserDetails;
  }
}
