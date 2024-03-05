export const prismaMock = {
  bot: {
    findMany: jest.fn().mockResolvedValue([{ id: 1 }]),
    findUnique: jest.fn().mockResolvedValue({
      zendesk_kba_endpoint: "http://fake.com"
    })

    // Add other methods as needed for your tests
  },
  knowledgeBaseArticle: {
    findFirst: jest.fn().mockResolvedValue({ id: 1 }),
    upsert: jest.fn().mockResolvedValue({ id: 1 }),
    delete: jest.fn().mockResolvedValue({})
  }
  // Mock other models as necessary
};

export class PrismaClient {
  constructor() {
    return prismaMock;
  }
}
