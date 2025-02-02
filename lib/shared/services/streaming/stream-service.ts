import { BaseLLM } from "../llm/base-llm";
import { StreamEncoder } from "./stream-encoder";
import { StreamMetadata } from "./types";
import { ConversationService } from "@/lib/chat/conversation";
import { buildSources } from "@/lib/chat/sources";
import { outputCost } from "@/lib/shared/services/openai/cost";
import prisma from "@/lib/prisma";
import type { Message } from "@prisma/client";
import type { OpenAiMessage } from "@/lib/chat/openai-chat-message";

export class StreamingService {
  private streamEncoder: StreamEncoder;

  constructor() {
    this.streamEncoder = new StreamEncoder();
  }

  createReadableStream(
    iterator: AsyncGenerator<Uint8Array, void, unknown>
  ): ReadableStream<Uint8Array> {
    return new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await iterator.next();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }

  async *createStreamIterator(
    response: any,
    llm: BaseLLM,
    metadata: StreamMetadata,
    conversationService: ConversationService,
    aiResponseMessage: Message,
    formattedMessages: OpenAiMessage[]
  ): AsyncGenerator<Uint8Array, void, undefined> {
    let fullResponse = "";
    let modelVersion: string | undefined = undefined;

    try {
      for await (const chunk of response.toReadableStream()) {
        const textChunk = this.streamEncoder.decodeChunk(chunk);

        try {
          const jsonChunk = JSON.parse(textChunk);

          if (!llm.shouldSkipChunk(jsonChunk)) {
            const text = llm.parseChunk(jsonChunk);

            if (text) {
              fullResponse += text;

              yield this.streamEncoder.encodeSSEMessage({
                text
              });
            }

            if (!modelVersion) {
              modelVersion = llm.getModelVersion(jsonChunk);
            }
          }
        } catch (error) {
          console.error("Error parsing JSON from chunk", error);
        }
      }

      // Handle final response and metadata
      yield* await this.handleStreamCompletion(
        fullResponse,
        modelVersion,
        metadata,
        conversationService,
        aiResponseMessage,
        formattedMessages
      );
    } catch (error) {
      console.error("Error in stream processing:", error);
      throw error;
    }
  }

  private async *handleStreamCompletion(
    fullResponse: string,
    modelVersion: string | undefined,
    metadata: StreamMetadata,
    conversationService: ConversationService,
    aiResponseMessage: Message,
    formattedMessages: OpenAiMessage[]
  ): AsyncGenerator<Uint8Array, void, undefined> {
    const formattedSources = buildSources(fullResponse, metadata.sources, true);

    // Update AI message
    const aiMessage = {
      text: fullResponse,
      finished: true,
      sources:
        formattedSources.length === 0 ? null : formattedSources.join(", "),
      apiResponseCost:
        metadata.inputAiCost + outputCost(fullResponse, metadata.model)
    };

    await conversationService.updateMessage(aiResponseMessage.id, aiMessage);

    // Create AI input log
    await prisma.aiInput.create({
      data: {
        botId: aiResponseMessage.bot_id,
        conversationId: metadata.conversationId,
        messageId: aiResponseMessage.id,
        log: {
          aiMessage,
          modelVersion,
          formattedMessages,
          responseTime: `${((Date.now() - metadata.startTime) / 1000).toFixed(2)}s`
        }
      }
    });

    yield this.streamEncoder.encodeClosingMessage({
      sources: formattedSources,
      conversation_id: metadata.conversationId,
      message_id: metadata.messageId
    });

    // Send closing message
  }
}
