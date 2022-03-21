import MTProto from "mtproto";
import RPC from "mtproto/rpc/mod.ts";

export interface UI {
  askCode(): Promise<string>;
  askPassword(): Promise<string>;
  askSignUp(): Promise<{ first_name: string; last_name: string } | undefined>;
}

async function login2fa(rpc: RPC, ui: UI) {
}

export async function login(
  proto: MTProto,
  ui: UI,
  phone_number: string,
  logout_tokens: BufferSource[],
) {
  let rpc = await proto.rpc();
  do {
    const sent = (await rpc.api.auth.sendCode({
      phone_number,
      settings: {
        _: "codeSettings",
        logout_tokens,
      },
    }));
    if (!sent.ok) {
      if (sent.error as string == "SESSION_PASSWORD_NEEDED") {
        return await login2fa(rpc, ui);
      } else if (sent.error == "AUTH_RESTART") {
        continue;
      } else {
        throw new Error(sent.error);
      }
    }
    const phone_code_hash = sent.value.phone_code_hash;
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
        ...signupinfo
      })).unwrap();
      if (signup._ != "auth.authorization") throw new Error("failed to signup")
      sign.value = signup;
    }
    return sign.value;
  } while (false);
}
