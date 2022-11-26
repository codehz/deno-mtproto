import { deserialize } from "../tl/deserializer.ts";
import { tou8 } from "../common/utils.ts";
import { AnyObject } from "../gen/api.js";
import { gunzip } from "https://deno.land/x/denoflate@1.2.1/mod.ts";

export function decompress(buffer: BufferSource) {
  return gunzip(tou8(buffer));
}

export function decompressObject<T extends AnyObject = AnyObject>(
  obj: AnyObject,
): T {
  if (obj._ == "mt.gzip_packed") {
    return deserialize<T>(decompress(obj.packed_data));
  }
  return obj as any;
}
