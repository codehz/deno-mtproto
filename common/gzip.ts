import { gunzipSync } from "https://esm.sh/fflate@0.8.1";
import { tou8 } from "../common/utils.ts";
import { AnyObject } from "../gen/api.js";
import { deserialize } from "../tl/deserializer.ts";

export function decompress(buffer: BufferSource) {
  return gunzipSync(tou8(buffer));
}

export function decompressObject<T extends AnyObject = AnyObject>(
  obj: AnyObject
): T {
  if (obj._ == "mt.gzip_packed") {
    return deserialize<T>(decompress(obj.packed_data));
  }
  return obj as any;
}
