import MTProto from "mtproto";
import srp from "mtproto/crypto/srp.ts";
import RPC from "mtproto/rpc/mod.ts";
import parse_error from "mtproto/common/errparse.ts";

export interface SendCodeUI {
  askCode(): Promise<string>;
  askPassword(hint?: string): Promise<string>;
  askSignUp(): Promise<{ first_name: string; last_name: string } | undefined>;
}

async function login2fa(rpc: RPC, ui: SendCodeUI) {
  const passinfo = (await rpc.api.account.getPassword()).unwrap();
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
  return (await rpc.api.auth.checkPassword({
    password: {
      _: "inputCheckPasswordSRP",
      srp_id: passinfo.srp_id!,
      ...srpres,
    },
  })).unwrap();
}

export async function sendCode(
  proto: MTProto,
  ui: SendCodeUI,
  phone_number: string,
  logout_tokens: BufferSource[] = [],
) {
  while (true) {
    const rpc = await proto.rpc();
    const sent = (await rpc.api.auth.sendCode({
      phone_number,
      settings: {
        _: "codeSettings",
        logout_tokens,
      },
    }));
    if (!sent.ok) {
      let mig_dc: number | null;
      if (sent.error as string == "SESSION_PASSWORD_NEEDED") {
        return await login2fa(rpc, ui);
      } else if ((mig_dc = parse_error("PHONE_MIGRATE_", sent.error)) != null) {
        proto.default_dc = mig_dc;
        continue;
      } else if (sent.error == "AUTH_RESTART") {
        continue;
      } else {
        throw new Error(sent.error);
      }
    }
    const phone_code_hash = sent.value.phone_code_hash;
    try {
      const phone_code = await ui.askCode();
      const sign = await rpc.api.auth.signIn({
        phone_number,
        phone_code_hash,
        phone_code,
      });
      if (!sign.ok) {
        if (sign.error as string == "SESSION_PASSWORD_NEEDED") {
          return await login2fa(rpc, ui);
        } else if (sign.error == "PHONE_CODE_EXPIRED") {
          continue;
        } else {
          throw new Error(sign.error);
        }
      }
      if (sign.value._ == "auth.authorizationSignUpRequired") {
        const signupinfo = await ui.askSignUp();
        if (!signupinfo) throw new Error("need sign up");
        const signup = (await rpc.api.auth.signUp({
          phone_number,
          phone_code_hash,
          ...signupinfo,
        })).unwrap();
        if (signup._ != "auth.authorization") {
          throw new Error("failed to signup");
        }
        sign.value = signup;
      }
      return sign.value;
    } catch (e) {
      await rpc.api.auth.cancelCode({ phone_number, phone_code_hash });
      throw e;
    }
  }
}
