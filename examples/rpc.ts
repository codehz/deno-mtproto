import RPC from "mtproto/rpc/mod.ts";
import factory from "mtproto/transport/connection/websocket.ts";
// import Padded from "mtproto/transport/codec/padded.ts";
// import Full from "mtproto/transport/codec/full.ts";
import Abridged from "mtproto/transport/codec/abridged.ts";
// import Intermediate from "mtproto/transport/codec/intermediate.ts";
import Obfuscated from "mtproto/transport/codec/obfuscated.ts";
import { decode } from "mtproto/tl/json.ts";

const create = factory(() => new Obfuscated(new Abridged()));
const transport = await create({
  id: 2,
  test: true,
  ip: "149.154.167.40",
  port: 80,
});

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
  *[Symbol.iterator]() {
    for (const key in localStorage) {
      yield [key, localStorage.getItem(key)!] as [string, string];
    }
  },
};

const rpc = new RPC(transport, storage, "main-test-2", api_id, api_hash, {
  app_version: "1.0",
  device_model: "Unknown",
  system_version: "1.0",
});

try {
  const cfg = await rpc.api.help.getConfig();
  console.log(cfg);
  const appcfg = await rpc.api.help.getAppConfig();
  console.log(decode(appcfg));
} finally {
  rpc.close();
}
