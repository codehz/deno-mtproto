import { Transport, TransportEvent, TransportEvents } from "mtproto/types.ts";
// import { Obfuscated } from "./obfuscated.ts";
import { concat_array, todv, view_arr } from "mtproto/common/utils.ts";

export class DenoTransport implements Transport {
  #closed = false;
  #conn: Deno.Conn;
  #buf = new Uint8Array(4);
  #view = todv(this.#buf);
  readonly init: Promise<number>;

  constructor(conn: Deno.Conn) {
    this.#conn = conn;
    this.init = this.#conn.write(new Uint8Array([0xee, 0xee, 0xee, 0xee]));
  }

  async send(packet: Uint8Array): Promise<void> {
    this.#view.setUint32(0, packet.length, true);
    await this.#conn.write(this.#buf);
    await this.#conn.write(packet);
  }
  async *[Symbol.asyncIterator](): AsyncIterator<
    TransportEvent<keyof TransportEvents>
  > {
    let stream = new Uint8Array();
    const temp = new Uint8Array(1024 * 64);
    let res: number | null = null;
    while ((res = await this.#conn.read(temp)) != null) {
      stream = concat_array(
        stream,
        temp.subarray(0, res),
      );
      while (stream.length >= 8) {
        const dataView = todv(stream);
        const payloadLength = dataView.getUint32(0, true);
        if (payloadLength > stream.length - 4) break;
        const payload = view_arr(stream, 4, payloadLength);
        if (payloadLength === 4) {
          const code = dataView.getInt32(4, true) * -1;
          yield { _: "error", code };
        } else {
          yield { _: "message", data: payload };
        }
        stream = stream.subarray(payloadLength + 4);
      }
    }
    console.log("closed");
  }
  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#conn.close();
  }
}

// export class DenoTransport implements Transport {
//   #closed = false;
//   #conn: Deno.Conn;
//   #obfuscated = new Obfuscated();

//   constructor(conn: Deno.Conn) {
//     this.#conn = conn;
//   }

//   init() {
//     return this.#conn.write(this.#obfuscated.init);
//   }

//   async send(packet: Uint8Array): Promise<void> {
//     const data = new Uint8Array(packet.length + 4);
//     const view = todv(data);
//     view.setUint32(0, packet.length, true);
//     data.set(packet, 4);
//     const obfuscated = this.#obfuscated.obfuscate(data);
//     console.log("sending", packet.length);
//     console.log(obfuscated);
//     const sent = await this.#conn.write(obfuscated);
//     console.log("sent", sent);
//   }
//   async *[Symbol.asyncIterator](): AsyncIterator<
//     TransportEvent<keyof TransportEvents>
//   > {
//     let stream = new Uint8Array();
//     const temp = new Uint8Array(1024 * 64);
//     let res: number | null = null;
//     while ((res = await this.#conn.read(temp)) != null) {
//       console.log(`recv ${res} (${stream.length})`);
//       stream = concat_array(
//         stream,
//         this.#obfuscated.deobfuscate(temp.subarray(0, res)),
//       );
//       while (stream.length >= 8) {
//         const dataView = todv(stream);
//         const payloadLength = dataView.getUint32(0, true);
//         if (payloadLength > stream.length - 4) break;
//         const payload = view_arr(stream, 4, payloadLength);
//         if (payloadLength === 4) {
//           const code = dataView.getInt32(4, true) * -1;
//           yield { _: "error", code };
//         } else {
//           yield { _: "message", data: payload };
//         }
//         stream = view_arr(stream, payloadLength + 4);
//       }
//     }
//     console.log("closed");
//   }
//   close(): void {
//     if (this.#closed) return;
//     this.#closed = true;
//     this.#conn.close();
//   }
// }

export default async function createTransport(
  ip: string,
  port: number,
): Promise<Transport> {
  const conn = await Deno.connect({ hostname: ip, port });
  const transport = new DenoTransport(conn);
  try {
    await transport.init;
    return transport;
  } catch (e) {
    transport.close();
    throw e;
  }
}
