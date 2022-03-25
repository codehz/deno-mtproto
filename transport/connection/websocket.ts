import {
  PacketCodec,
  Transport,
  TransportEvent,
  TransportEvents,
  TransportFactory,
} from "mtproto/types.ts";
import { concat_array, todv } from "mtproto/common/utils.ts";

import Resolver from "mtproto/common/resolver.ts";

class PendingRead {
  #buffer: Uint8Array;
  #wait: Resolver<number | null>;

  constructor(buffer: Uint8Array) {
    this.#buffer = buffer;
    this.#wait = new Resolver();
  }

  get promise() {
    return this.#wait.promise;
  }

  fill(input: Uint8Array): Uint8Array | undefined {
    this.#buffer.set(input);
    if (input.length > this.#buffer.length) {
      this.#wait.resolve(this.#buffer.length);
      return input.subarray(this.#buffer.length);
    }
    this.#wait.resolve(input.length);
  }

  zero() {
    this.#wait.resolve(null);
  }

  get reject() {
    return this.#wait.reject;
  }
}

class WebSocketWrapper implements Deno.Reader {
  #buffer: Uint8Array | undefined;
  #conn: WebSocket;
  #pending: PendingRead | undefined;

  constructor(conn: WebSocket) {
    this.#conn = conn;
    this.#conn.binaryType = "arraybuffer";
    this.#conn.onmessage = ({ data }) => {
      const u8 = new Uint8Array(data);
      if (this.#pending) {
        this.#buffer = this.#pending.fill(u8);
        this.#pending = undefined;
      } else if (this.#buffer) {
        this.#buffer = concat_array(this.#buffer, u8);
      } else {
        this.#buffer = u8;
      }
    };
    this.#conn.onerror = (e) => {
      this.#pending?.reject(e);
    };
    this.#conn.onclose = () => {
      this.#pending?.zero();
      this.#pending = undefined;
    };
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve) => this.#conn.onopen = () => resolve());
  }

  async read(p: Uint8Array): Promise<number | null> {
    if (this.#conn.readyState > 1) return null;
    if (this.#buffer) {
      const len = Math.min(p.length, this.#buffer.length);
      p.set(this.#buffer.subarray(0, len));
      this.#buffer = this.#buffer.subarray(len);
      if (this.#buffer.length == 0) this.#buffer = undefined;
      return len;
    }
    return (this.#pending = new PendingRead(p)).promise;
  }

  send(data: Uint8Array) {
    this.#conn.send(data);
  }

  close() {
    this.#conn.close();
  }
}

export class WebSocketTransport implements Transport {
  #closed = false;
  #conn: WebSocketWrapper;
  #codec: PacketCodec;
  init?: Promise<any>;

  constructor(conn: WebSocketWrapper, codec: PacketCodec) {
    this.#conn = conn;
    this.#codec = codec;
    if (this.#codec.init == null || !this.#codec.obfuscated) {
      throw new Error("Obfuscated codec is required for websocket");
    }
    this.#conn.send(this.#codec.init);
  }

  async send(packet: Uint8Array): Promise<void> {
    this.#conn.send(concat_array(...this.#codec.encode_packet(packet)));
  }

  async *[Symbol.asyncIterator](): AsyncIterator<
    TransportEvent<keyof TransportEvents>
  > {
    for await (const piece of this.#codec.read_packet(this.#conn)) {
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
    this.#conn.close();
  }
}

export default function createFactory(
  codec: () => PacketCodec,
): TransportFactory {
  return async (ip, port) => {
    const addr = (port == 443 ? "wss" : "ws") + "://" + ip + ":" + port;
    const conn = new WebSocketWrapper(new WebSocket(addr));
    await conn.connect();
    try {
      const transport = new WebSocketTransport(conn, codec());
      await transport.init;
      return transport;
    } catch (e) {
      conn.close();
      throw e;
    }
  };
}
