import {
  PacketCodec,
  Transport,
  TransportEvent,
  TransportEvents,
  TransportFactory,
} from "mtproto/types.ts";
import { todv } from "mtproto/common/utils.ts";

export class DenoTCP implements Transport {
  #closed = false;
  #conn: Deno.Conn;
  #codec: PacketCodec;
  init?: Promise<any>;

  constructor(conn: Deno.Conn, codec: PacketCodec) {
    this.#conn = conn;
    this.#codec = codec;
    if (codec.init) this.init = this.#conn.write(codec.init);
  }

  async send(packet: Uint8Array): Promise<void> {
    try {
      for (const piece of this.#codec.encode_packet(packet)) {
        await this.#conn.write(piece);
      }
    } catch (e) {
      if (e instanceof Deno.errors.BadResource && this.#closed) {
        return;
      }
      throw e;
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<
    TransportEvent<keyof TransportEvents>
  > {
    try {
      for await (const piece of this.#codec.read_packet(this.#conn)) {
        if (piece.length == 4) {
          const code = todv(piece).getUint32(0, true);
          yield { _: "error", code };
        } else {
          yield { _: "message", data: piece };
        }
      }
    } catch (e) {
      if (e instanceof Deno.errors.BadResource && this.#closed) {
        return;
      }
      throw e;
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
    const conn = await Deno.connect({ hostname: ip, port });
    try {
      const transport = new DenoTCP(conn, codec());
      await transport.init;
      return transport;
    } catch (e) {
      conn.close();
      throw e;
    }
  };
}
