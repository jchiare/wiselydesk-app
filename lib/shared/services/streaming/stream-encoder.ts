import type { StreamResponse } from "./types";

export class StreamEncoder {
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  encodeSSEMessage(data: StreamResponse): Uint8Array {
    const messageData = JSON.stringify(data);
    const message = `id: ${Date.now()}\nevent: message\ndata: ${messageData}\n\n`;
    return this.encoder.encode(message);
  }

  encodeClosingMessage(data: StreamResponse): Uint8Array {
    const messageData = JSON.stringify(data);
    const message = `id: ${Date.now()}\nevent: closing_connection\ndata: ${messageData}\n\n`;
    return this.encoder.encode(message);
  }

  decodeChunk(chunk: Uint8Array): string {
    return this.decoder.decode(chunk, { stream: true });
  }
}
