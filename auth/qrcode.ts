import MTProto from "mtproto";
import { tou8 } from "mtproto/common/utils.ts";

async function* login(
  client: MTProto,
  except_ids: bigint[] = [],
) {
  let rpc = await client.rpc();
  while (true) {
    let token = (await rpc.api.auth.exportLoginToken({ except_ids }))
      .unwrap();
    do {
      switch (token._) {
        case "auth.loginToken":
          yield tou8(token.token);
          // TODO: wait update
          break;
        case "auth.loginTokenMigrateTo":
          rpc = await client.rpc(client.getDcId(token.dc_id));
          token = (await rpc.api.auth.importLoginToken({ token: token.token }))
            .unwrap();
          continue;
        case "auth.loginTokenSuccess":
          return token.authorization;
      }
    } while (false);
  }
}
