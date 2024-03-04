import nock from "nock";
import httpMocks from "node-mocks-http";
import { POST } from "@/src/app/api/webhook/help-center-update/route";
jest.mock("@prisma/client");

jest.mock("@/lib/shared/services/openai/embeddings", () => {
  return {
    OpenAIEmbedder: jest.fn().mockImplementation(() => {
      return {
        createEmbedding: jest.fn().mockResolvedValue([0.2, 0.3, 0.4])
      };
    })
  };
});

const PUBLISHED_WEBHOOK_PAYLOAD = {
  account_id: 9251815,
  detail: {
    brand_id: "360002395532",
    id: "360032829291"
  },
  event: {
    author_id: "385104635411",
    category_id: "360004593212",
    locale: "en-us",
    section_id: "4418977303188",
    title: "Keyboard shortcuts for AMBOSS"
  },
  id: "01HQXD4YKHMS0NVGP51D23HMQ5",
  subject: "zen:article:360032829291",
  time: "2024-03-01T16:21:54.411050603Z",
  type: "zen:event-type:article.published",
  zendesk_event_version: "2022-11-06"
};

describe("Zendesk KBA Webhook ", () => {
  it("should update KBA", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/webhook/help-center-update",
      headers: {
        "x-wiselydesk-zendesk-account-id": "9251815"
      },
      body: PUBLISHED_WEBHOOK_PAYLOAD
    });
    req.json = jest.fn().mockResolvedValue(PUBLISHED_WEBHOOK_PAYLOAD);

    nock("http://fake.com:")
      .get("/360032829291")
      .query({ include: "categories,sections" })
      .reply(200, {
        article: { id: "360032829291", title: "Test Article" }, // Mock response data
        next_page: null // Indicate no more pages
      });

    // @ts-expect-error it's a test ..
    req.headers.get = (headerName: string) =>
      req.headers[headerName.toLowerCase()];

    // @ts-expect-error it's a test
    const res = await POST(req);

    const responseMessage = await res.text();
    expect(responseMessage).toBe(
      '{"message":"Updated kbaId 360032829291 for botId 1"}'
    );
    expect(res.status).toBe(200);
  });
  it.skip("should delete KBA", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/webhook/help-center-update",
      headers: {
        "x-wiselydesk-zendesk-account-id": "9251815"
      },
      body: PUBLISHED_WEBHOOK_PAYLOAD
    });
    req.json = jest.fn().mockResolvedValue(PUBLISHED_WEBHOOK_PAYLOAD);

    nock("http://fake.com:")
      .get("/360032829291")
      .query({ include: "categories,sections" })
      .reply(200, {
        article: { id: "360032829291", title: "Test Article" }, // Mock response data
        next_page: null // Indicate no more pages
      });

    // @ts-expect-error it's a test ..
    req.headers.get = (headerName: string) =>
      req.headers[headerName.toLowerCase()];

    // @ts-expect-error it's a test
    const res = await POST(req);

    const responseMessage = await res.text();
    expect(responseMessage).toBe(
      '{"message":"Updated kbaId 360032829291 for botId 1"}'
    );
    expect(res.status).toBe(200);
  });
});
