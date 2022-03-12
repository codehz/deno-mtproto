import {
  PacketCodec,
  Transport,
  TransportEvent,
  TransportEvents,
  TransportFactory,
} from "mtproto/types.ts";
import { concat_array, todv, view_arr } from "mtproto/common/utils.ts";

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
    for (const piece of this.#codec.encode_packet(packet)) {
      console.log(piece);
      this.#conn.write(piece);
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<
    TransportEvent<keyof TransportEvents>
  > {
    for await (const piece of this.#codec.read_packet(this.#conn)) {
      if (piece.length == 4) {
        const code = todv(piece).getUint32(0, true);
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
