import { deserialize } from "mtproto/tl/deserializer.ts";
import { tou8 } from "mtproto/common/utils.ts";
import { AnyObject } from "mtproto/gen/api.js";
import { gunzip } from "denoflate";

export function decompress(buffer: BufferSource) {
  return gunzip(tou8(buffer));
}

export function decompressObject<T extends AnyObject = AnyObject>(obj: AnyObject): T {
  if (obj._ == "mt.gzip_packed") {
    return deserialize<T>(decompress(obj.packed_data));
  }
  return obj as any;
}
