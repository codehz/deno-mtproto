import { PacketCodec } from "../../types.ts";
import { concat_array, todv, view_arr } from "../../common/utils.ts";
import crc32 from "../../crypto/crc32.ts";

export default class Full implements PacketCodec {
  #sendbuf = new Uint8Array(8);
  #dv = todv(this.#sendbuf);
  #seq = 0;

  *encode_packet(data: Uint8Array): Iterable<Uint8Array> {
    const len = data.length + 12;
    this.#dv.setUint32(0, len, true);
    this.#dv.setUint32(4, this.#seq++, true);
    yield this.#sendbuf;
    yield data;
    const crc = crc32(this.#sendbuf, data);
    this.#dv.setUint32(0, crc, true);
    yield view_arr(this.#sendbuf, 0, 4);
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
      while (stream.length >= 16) {
        const dataView = todv(stream);
        const length = dataView.getUint32(0, true);
        if (length > stream.length) break;
        const crcbody = stream.subarray(0, length - 4);
        const crc = crc32(crcbody);
        const crc_got = dataView.getUint32(length - 4, true);
        if (crc != crc_got) {
          throw new Error(`crc mismatch, expect ${crc} got ${crc_got}`);
        }
        yield view_arr(stream, 8, length - 12);
        stream = stream.subarray(length);
      }
    }
  }
}
