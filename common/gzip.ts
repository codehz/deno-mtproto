import { deserialize } from "mtproto/tl/deserializer.ts";
import { tou8 } from "mtproto/common/utils.ts";
import { gunzip } from "denoflate";

export function decompress(buffer: BufferSource) {
  return gunzip(tou8(buffer));
}

export function decompressObject<T = any>(buffer: BufferSource): T {
  return deserialize<T>(decompress(buffer));
}
