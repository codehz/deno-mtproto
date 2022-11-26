import MTProto from "../mod.ts";
import parse_error from "../common/errparse.ts";
import { RPCError } from "../rpc/mod.ts";

export async function loginAsBot(proto: MTProto, token: string) {
  while (true) {
    const rpc = await proto.rpc();
    let ret;
    try {
      ret = await rpc.api.auth.importBotAuthorization({
        flags: 0,
        bot_auth_token: token,
      });
    } catch (e) {
      if (e instanceof RPCError) {
        let mig_dc;
        if (
          (mig_dc = parse_error("USER_MIGRATE_", e.message)) != null
        ) {
          proto.default_dc = mig_dc;
          continue;
        } else if (e.message == "API_ID_INVALID") {
          throw new Error("Invalid api id", { cause: e });
        } else if (e.message == "API_ID_PUBLISHED_FLOOD") {
          throw new Error("Invalid api id", { cause: e });
        } else {
          throw new Error("unknown error code", { cause: e });
        }
      }
      throw e;
    }
    if (ret._ !== "auth.authorization") {
      throw new Error(`Invalid response: ${ret._}`);
    }
    return ret;
  }
}
