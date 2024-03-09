import OpenAI from "openai";
import type { Stream } from "openai/streaming";

const openai = new OpenAI();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// export const runtime = "edge";

export async function POST(req: Request) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Say this is a testing 3 times" }],
    stream: true
  });

  const iterator = makeIterator(response);
  const stream = iteratorToStream(iterator);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none"
    }
  });
}

function iteratorToStream(
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

async function* makeIterator(
  response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
): AsyncGenerator<Uint8Array, void, undefined> {
  // @ts-expect-error - TS doesn't know about the toReadableStream method well
  for await (const chunk of response.toReadableStream()) {
    const textChunk = decoder.decode(chunk, { stream: true });
    try {
      const parsedChunk = JSON.parse(textChunk);
      const text = parsedChunk.choices[0]?.delta?.content || "";
      yield encoder.encode(text);
    } catch (error) {
      console.error("Error parsing JSON from chunk", error);
    }
  }

  const remainingText = decoder.decode();
  if (remainingText) {
    console.log("remaing text??");
    yield encoder.encode(remainingText);
  }
}
