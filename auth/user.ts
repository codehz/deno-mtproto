import MTProto from "../mod.ts";
import srp from "../crypto/srp.ts";
import RPC, { RPCError } from "../rpc/mod.ts";
import parse_error from "../common/errparse.ts";

export interface SendCodeUI {
  askCode(): Promise<string>;
  askPassword(hint?: string): Promise<string>;
  askSignUp(): Promise<{ first_name: string; last_name: string } | undefined>;
}

async function login2fa(rpc: RPC, ui: SendCodeUI) {
  const passinfo = await rpc.api.account.getPassword();
  if (
    !passinfo.current_algo ||
    passinfo.current_algo._ == "passwordKdfAlgoUnknown"
  ) {
    throw new Error("unknown alg");
  }
  if (!passinfo.srp_B || !passinfo.srp_id) throw new Error("no srp params");
  const password = await ui.askPassword(passinfo.hint);
  const srpres = await srp(passinfo.current_algo, {
    gb: passinfo.srp_B,
    password,
  });
  return await rpc.api.auth.checkPassword({
    password: {
      _: "inputCheckPasswordSRP",
      srp_id: passinfo.srp_id!,
      ...srpres,
    },
  });
}

export async function sendCode(
  proto: MTProto,
  ui: SendCodeUI,
  phone_number: string,
  logout_tokens: BufferSource[] = []
) {
  while (true) {
    const rpc = await proto.rpc();
    let sent;
    try {
      sent = await rpc.api.auth.sendCode({
        phone_number,
        settings: {
          _: "codeSettings",
          logout_tokens,
        },
      });
    } catch (e) {
      if (e instanceof RPCError) {
        let mig_dc;
        if (e.message == "SESSION_PASSWORD_NEEDED") {
          return await login2fa(rpc, ui);
        } else if (
          (mig_dc = parse_error("PHONE_MIGRATE_", e.message)) != null
        ) {
          proto.default_dc = mig_dc;
          continue;
        } else if (e.message == "AUTH_RESTART") {
          continue;
        } else {
          throw new Error("unknown error code", { cause: e });
        }
      }
      throw e;
    }
    if (sent._ === "auth.sentCodeSuccess") {
      if (sent.authorization._ === "auth.authorizationSignUpRequired") {
        throw new Error("need sign up");
      } else {
        return sent.authorization;
      }
    } else {
      const phone_code_hash = sent.phone_code_hash;
      try {
        const phone_code = await ui.askCode();
        let sign;
        try {
          sign = await rpc.api.auth.signIn({
            phone_number,
            phone_code_hash,
            phone_code,
          });
        } catch (e) {
          if (e instanceof RPCError) {
            if (e.message == "SESSION_PASSWORD_NEEDED") {
              return await login2fa(rpc, ui);
            } else if (e.message == "PHONE_CODE_EXPIRED") {
              continue;
            } else {
              throw new Error("unknown error code", { cause: e });
            }
          }
          throw e;
        }
        if (sign._ == "auth.authorizationSignUpRequired") {
          const signupinfo = await ui.askSignUp();
          if (!signupinfo) throw new Error("need sign up");
          const signup = await rpc.api.auth.signUp({
            phone_number,
            phone_code_hash,
            ...signupinfo,
          });
          if (signup._ != "auth.authorization") {
            throw new Error("failed to signup");
          }
          sign = signup;
        }
        return sign;
      } catch (e) {
        await rpc.api.auth.cancelCode({ phone_number, phone_code_hash });
        throw e;
      }
    }
  }
}
