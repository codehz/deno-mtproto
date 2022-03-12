import { CTR } from "mtproto/crypto/aes.ts";
import { todv, view_arr } from "mtproto/common/utils.ts";
import { PacketCodec } from "mtproto/types.ts";

const badpatterns = [
  0x44414548,
  0x54534f50,
  0x20544547,
  0x4954504f,
  0xdddddddd,
  0xeeeeeeee,
  0x02010316,
];

export default class Obfuscated implements PacketCodec {
  init = new Uint8Array(64);
  #upper: PacketCodec;
  #enc_aes: CTR;
  #dec_aes: CTR;

  constructor(upper: PacketCodec) {
    if (upper.obfuscate_tag == null) throw new Error("unsupported codec");
    this.#upper = upper;
    while (true) {
      crypto.getRandomValues(this.init);
      if (this.init[0] == 0xef) continue;
      const view = todv(this.init);
      this.init.set(upper.obfuscate_tag, 56);
      const firstInt = view.getUint32(0, true);
      if (badpatterns.includes(firstInt)) continue;
      const secondInt = view.getUint32(4, true);
      if (secondInt === 0) continue;
      break;
    }
    const initrev = this.init.slice(0).reverse();
    const enc_key = view_arr(this.init, 8, 32);
    const enc_iv = view_arr(this.init, 40, 16);
    const dec_key = view_arr(initrev, 8, 32);
    const dec_iv = view_arr(initrev, 40, 16);

    this.#enc_aes = new CTR(enc_key, enc_iv);
    this.#dec_aes = new CTR(dec_key, dec_iv);

    const encryptedInitBytes = this.#obfuscate(this.init);
    this.init.set(view_arr(encryptedInitBytes, 56, 8), 56);
  }

  *encode_packet(data: Uint8Array): Iterable<Uint8Array> {
    for (const item of this.#upper.encode_packet(data)) {
      yield this.#obfuscate(item);
    }
  }

  read_packet(reader: Deno.Reader): AsyncIterable<Uint8Array> {
    return this.#upper.read_packet({
      read: async (buffer) => {
        const len = await reader.read(buffer);
        buffer.set(this.#deobfuscate(buffer));
        return len;
      },
    });
  }

  #obfuscate(bytes: BufferSource) {
    return this.#enc_aes.encrypt(bytes);
  }

  #deobfuscate(bytes: BufferSource) {
    return this.#dec_aes.decrypt(bytes);
  }
}
