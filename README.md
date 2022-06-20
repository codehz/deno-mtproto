# MTProto for deno

Status: WIP

basic usage:

```typescript
import MTProto from "mtproto";
import factory from "mtproto/transport/connection/deno-tcp.ts";
import Abridged from "mtproto/transport/codec/abridged.ts";
import JsonDB from "mtproto/storage/jsondb.ts";
import { sendCode } from "mtproto/auth/user.ts";
import {
  Confirm,
  Input,
  Secret,
} from "https://deno.land/x/cliffy@v0.22.2/prompt/mod.ts";

const db = new JsonDB("diag_mod.json");

const proto = new MTProto({
  api_id: 0, // your api id
  api_hash: "YOUR_API_HASH",
  environment: {
    app_version: "8.6.1",
    device_model: "Unknown",
    system_version: "1.0.0",
  },
  ipv6_policy: "ipv4",
  transport_factory: factory(() => new Abridged()),
  storage: db,
});

await proto.init();

const rpc = await proto.rpc();

// TODO: check if user is logged

await sendCode(proto, {
  async askCode() {
    return await Input.prompt("Phone code");
  },
  async askPassword(hint) {
    return await Secret.prompt(
      "2FA Password" + (hint ? `(hint: ${hint})` : ""),
    );
  },
  async askSignUp() {
    if (await Confirm.prompt("Sign up")) {
      const first_name = await Input.prompt("First name");
      const last_name = await Input.prompt("Last name");
      return { first_name, last_name };
    }
  },
}, await Input.prompt("Phone number"));
```
