import { CTR } from "mtproto/crypto/aes.ts";
import { sha256, todv, view_arr } from "mtproto/common/utils.ts";
import { type PacketCodec } from "mtproto/types.ts";
import { type DCIdentifier, toDCInfo } from "mtproto/common/dc.ts";

const badpatterns = [
  0x44414548,
  0x54534f50,
  0x20544547,
  0x4954504f,
  0xdddddddd,
  0xeeeeeeee,
  0x02010316,
];

export interface ObfuscateOptions {
  dc?: DCIdentifier;
  secret?: Uint8Array;
}

function gendcnumid(id: DCIdentifier) {
  let { test, type, id: num } = toDCInfo(id);
  if (test) num += 10000;
  if (type != "main") num *= -1;
  return num;
}

export default class Obfuscated implements PacketCodec {
  init = new Uint8Array(64);
  #upper: PacketCodec;
  #enc_aes: CTR;
  #dec_aes: CTR;

  constructor(upper: PacketCodec, options: ObfuscateOptions = {}) {
    if (upper.obfuscate_tag == null) throw new Error("unsupported codec");
    this.#upper = upper;
    while (true) {
      crypto.getRandomValues(this.init);
      if (this.init[0] == 0xef) continue;
      const view = todv(this.init);
      this.init.set(upper.obfuscate_tag, 56);
      if (options.dc) {
        const num = gendcnumid(options.dc);
        view.setUint32(60, num, true);
      }
      const firstInt = view.getUint32(0, true);
      if (badpatterns.includes(firstInt)) continue;
      const secondInt = view.getUint32(4, true);
      if (secondInt === 0) continue;
      break;
    }
    const initrev = this.init.slice(0).reverse();
    let enc_key = view_arr(this.init, 8, 32);
    let dec_key = view_arr(initrev, 8, 32);
    if (options.secret) {
      enc_key = sha256(enc_key, options.secret.subarray(1));
      dec_key = sha256(dec_key, options.secret.subarray(1));
    }
    const enc_iv = view_arr(this.init, 40, 16);
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
        if (len) {
          buffer.set(this.#deobfuscate(buffer.subarray(0, len)));
        }
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
