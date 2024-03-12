import { isConversationLivemode } from "@/lib/chat/conversation/livemode";
import { getStaticBotText } from "@/lib/chat/conversation/static-bot-text";
import { PrismaClient, type Conversation, type Message } from "@prisma/client";

type Payload = {
  text: string;
  conversationId: number | undefined;
  apiResponseCost?: number;
  finished?: boolean;
  sources: string | null;
};

type UpdateMessagePayload = Omit<Payload, "conversationId">;

export class ConversationService {
  private prisma: PrismaClient;
  private isProductionTesting: boolean;
  private conversationId: number | undefined;
  private botId: number;

  constructor(
    prismaClient: PrismaClient,
    isProductionTesting: boolean,
    botId: number
  ) {
    this.prisma = prismaClient;
    this.isProductionTesting = isProductionTesting;
    this.botId = botId;
  }

  public getConversationId(): number {
    if (!this.conversationId) {
      throw new Error("Conversation ID is undefined");
    }
    return this.conversationId;
  }

  async getOrCreateConversation(
    userInput: string,
    conversationId: number | undefined
  ): Promise<void> {
    if (this.isProductionTesting) {
      this.conversationId = 1;
      return;
    }

    if (conversationId !== undefined) {
      // should probably verify the convoId is valid for the bot and time
      this.conversationId = conversationId;
      return;
    }

    const newConversationId = (await this.createConversation(userInput)).id;
    this.conversationId = newConversationId;

    // create welcome message since it's a new conversation
    await this.createWelcomeMessage();
  }

  private async createConversation(userInput: string): Promise<Conversation> {
    const startTime = Date.now();

    const publicID = await this.getNewPublicIdByBotId(this.botId);
    console.log(
      `Took ${((Date.now() - startTime) / 1000).toFixed(
        4
      )} seconds to get new public ID`
    );

    const conversation = await this.prisma.conversation.create({
      data: {
        bot_id: this.botId,
        public_id: publicID,
        user_id: 3,
        livemode: isConversationLivemode(userInput, this.botId),
        summary: userInput.slice(0, 255)
      }
    });

    console.log(
      `Took ${((Date.now() - startTime) / 1000).toFixed(
        4
      )} seconds to get create new conversation`
    );

    return conversation;
  }

  async createMessage({
    text,
    index,
    finished,
    sources,
    apiResponseCost
  }: {
    text: string;
    index: number;
    finished?: boolean;
    sources?: string;
    apiResponseCost?: number;
  }): Promise<Message> {
    return await this.prisma.message.create({
      data: {
        text,
        conversation_id: this.conversationId!,
        from_user_id: 3,
        to_user_id: 3,
        bot_id: this.botId,
        index: index,
        api_response_cost: apiResponseCost,
        finished,
        sources
      }
    });
  }

  async updateMessage(
    messageId: number,
    payload: UpdateMessagePayload
  ): Promise<void> {
    if (this.isProductionTesting) {
      return;
    }
    await this.prisma.message.update({
      where: { id: messageId },
      data: {
        text: payload.text,
        finished: payload.finished,
        sources: payload.sources,
        api_response_cost: payload.apiResponseCost
      }
    });
  }

  private async createWelcomeMessage(): Promise<void> {
    const welcomeMessage = getStaticBotText(this.botId);
    const welcomeMessageData = {
      text: welcomeMessage.welcome_message,
      index: 0,
      finished: true
    };
    await this.createMessage(welcomeMessageData);
  }

  private async getNewPublicIdByBotId(botId: number): Promise<number> {
    const botConversationCount = await this.prisma.conversation.aggregate({
      _max: {
        public_id: true
      },
      where: {
        bot_id: botId
      }
    });

    const maxPublicId = botConversationCount._max.public_id ?? 0;
    return maxPublicId + 1;
  }
}
