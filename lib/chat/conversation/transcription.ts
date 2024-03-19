import prisma from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
export class TranscriptionService {
  private conversationId: string;
  private messages: string[] | null;
  private prisma: PrismaClient;

  constructor(conversationId: string, prismaClient?: PrismaClient) {
    this.conversationId = conversationId;
    this.messages = null;
    this.prisma = prismaClient || prisma;
  }

  public async transcribe(): Promise<string> {
    if (this.messages === null) {
      await this.createMessages();
    }
    const formattedMessage = "- " + this.messages!.join("\n- ");
    return formattedMessage;
  }

  private async createMessages(): Promise<void> {
    const conversationIdInt = parseInt(this.conversationId);
    const fullMessages = await this.prisma.message.findMany({
      where: { conversation_id: conversationIdInt },
      orderBy: { index: "asc" }
    });

    if (fullMessages.length === 0) {
      throw new Error(
        `No messages found for conversation ID '${this.conversationId}'`
      );
    }

    this.messages = fullMessages
      .slice(1)
      .map(
        (message, index) =>
          `${index % 2 === 0 ? "User" : "Bot"} Message: ${message.text}<br>`
      );
  }
}
