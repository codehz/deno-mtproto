import {
  PacketCodec,
  Transport,
  TransportEvent,
  TransportEvents,
  TransportFactory,
} from "mtproto/types.ts";
import { todv } from "mtproto/common/utils.ts";

class BufferSync {
  #buffer: Uint8Array | undefined;

  get available() {
    return this.#buffer != undefined;
  }

  fill(output: Uint8Array) {
    if (this.#buffer == null) throw new Error("invalid buffer state");
    const size = Math.min(output.length, this.#buffer.length);
    const slice = this.#buffer.subarray(0, size);
    output.set(slice);
    this.#buffer = this.#buffer.subarray(size);
    if (this.#buffer.length == 0) this.#buffer = undefined;
    return size;
  }

  enqueue(data: Uint8Array, output: Uint8Array) {
    if (this.#buffer != null) throw new Error("invalid buffer state");
    if (data.length < output.length) {
      output.set(data);
      return data.length;
    }
    output.set(data.subarray(0, output.length));
    this.#buffer = data.subarray(output.length);
    return output.length;
  }
}

export class WebSocketTransport implements Transport {
  #closed = false;
  #stream: WebSocketStream;
  #conn: WebSocketConnection;
  #codec: PacketCodec;
  #reader: ReadableStreamDefaultReader<string | Uint8Array>;
  #writer: WritableStreamDefaultWriter<string | Uint8Array>;
  init: Promise<any>;

  constructor(
    stream: WebSocketStream,
    conn: WebSocketConnection,
    codec: PacketCodec,
  ) {
    this.#stream = stream;
    this.#conn = conn;
    this.#codec = codec;
    this.#reader = this.#conn.readable.getReader();
    this.#writer = this.#conn.writable.getWriter();
    if (this.#codec.init == null || !this.#codec.obfuscated) {
      throw new Error("Obfuscated codec is required for websocket");
    }
    this.init = this.#writer.write(this.#codec.init);
  }

  async send(packet: Uint8Array): Promise<void> {
    for (const piece of this.#codec.encode_packet(packet)) {
      await this.#writer.write(piece);
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<
    TransportEvent<keyof TransportEvents>
  > {
    let sync = new BufferSync();
    for await (
      const piece of this.#codec.read_packet({
        read: async (buf: Uint8Array) => {
          if (sync.available) {
            return sync.fill(buf);
          }
          const res = await this.#reader.read();
          if (res.done) return null;
          if (typeof res.value == "string") {
            throw new TypeError("expected Uint8Array, but got string");
          }
          return sync.enqueue(res.value, buf);
        },
      })
    ) {
      if (piece.length == 4) {
        const code = Math.abs(todv(piece).getInt32(0, true));
        yield { _: "error", code };
      } else {
        yield { _: "message", data: piece };
      }
    }
  }
  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#stream.close();
  }
}

export default function createFactory(
  codec: () => PacketCodec,
): TransportFactory {
  return async (ip, port) => {
    const addr = (port == 443 ? "wss" : "ws") + "://" + ip + ":" + port;
    const stream = new WebSocketStream(addr);
    try {
      const conn = await stream.connection;
      const transport = new WebSocketTransport(stream, conn, codec());
      await transport.init;
      return transport;
    } catch (e) {
      stream.close();
      throw e;
    }
  };
}
