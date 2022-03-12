import { PacketCodec } from "mtproto/types.ts";
import {
  concat_array,
  rand_int,
  todv,
  view_arr,
} from "mtproto/common/utils.ts";

const init = new Uint8Array([0xdd, 0xdd, 0xdd, 0xdd]);

export default class Padded implements PacketCodec {
  init = init;
  obfuscate_tag = init;
  #buffer = new Uint8Array(4 + 15);
  #dv = todv(this.#buffer);

  *encode_packet(data: Uint8Array): Iterable<Uint8Array> {
    const random = rand_int(15);
    const padding = view_arr(this.#buffer, 4, random);
    this.#dv.setInt32(0, data.length + random, true);
    crypto.getRandomValues(padding);
    yield this.#buffer.subarray(0, 4);
    yield data;
    yield padding;
  }
  async *read_packet(reader: Deno.Reader): AsyncIterable<Uint8Array> {
    let stream = new Uint8Array();
    const temp = new Uint8Array(4096);
    let res: number | null = null;

    while ((res = await reader.read(temp)) != null) {
      stream = concat_array(
        stream,
        temp.subarray(0, res),
      );
      while (stream.length >= 8) {
        const dataView = todv(stream);
        const payloadLength = dataView.getUint32(0, true);
        if (payloadLength > stream.length - 4) break;
        yield view_arr(stream, 4, payloadLength);
        stream = stream.subarray(payloadLength + 4);
      }
    }
  }
}
