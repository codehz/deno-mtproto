import RPC from "mtproto/rpc/mod.ts";
import factory from "mtproto/transport/connection/deno-tcp.ts";
// import Padded from "mtproto/transport/codec/padded.ts";
// import Full from "mtproto/transport/codec/full.ts";
import Abridged from "mtproto/transport/codec/abridged.ts";
// import Intermediate from "mtproto/transport/codec/intermediate.ts";
import Obfuscated from "mtproto/transport/codec/obfuscated.ts";
import { help } from "mtproto/gen/api.js";
import { decode } from "mtproto/tl/json.ts";

const create = factory(() => new Obfuscated(new Abridged()));
const transport = await create("149.154.167.40", 80);

console.log("connected");

const api_id = 4;
const api_hash = "014b35b6184100b085b0d0572f9b5103";

if (0) {
  localStorage.clear();
}

const storage = {
  set(key: string, value: string) {
    console.log("set", key, value);
    localStorage.setItem(key, value);
  },
  get(key: string) {
    const ret = localStorage.getItem(key);
    console.log("get", key, ret);
    return ret ?? undefined;
  },
  delete(key: string) {
    console.log("delete", key);
    localStorage.removeItem(key);
  },
};
const rpc = new RPC(transport, storage, "test-2", api_id, api_hash, {
  app_version: "1.0",
  device_model: "Unknown",
  system_version: "1.0",
});

try {
  const cfg = await rpc.call(help.getConfig);
  console.log(cfg.unwrap());
  const appcfg = await rpc.call(help.getAppConfig, {
    lang_code: "zh_CN",
    hash: 0,
  });
  console.log(appcfg.map(decode).unwrap());
} finally {
  rpc.close();
}
