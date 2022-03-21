import {
  frombig256,
  rand_bigint,
  sha256 as H,
  tobig,
  tou8,
  xor_array,
} from "mtproto/common/utils.ts";
import { modpow } from "mtproto/common/alg.ts";

import { pbkdf2 } from "crypto/pbkdf2.ts";
import api from "mtproto/gen/api.js";

const SH = (data: Uint8Array, salt: Uint8Array) => H(salt, data, salt);

const PH1 = (password: Uint8Array, salt1: Uint8Array, salt2: Uint8Array) =>
  SH(SH(password, salt1), salt2);

const PH2 = (password: Uint8Array, salt1: Uint8Array, salt2: Uint8Array) =>
  SH(pbkdf2("sha512", PH1(password, salt1, salt2), salt1, 100000, 64), salt2);

function hybig(src: BufferSource | bigint) {
  if (typeof src == "bigint") {
    return {
      data: frombig256(src),
      big: src,
    };
  }
  const data = tou8(src);
  return {
    data,
    big: tobig(data),
  };
}

export default function srp(
  algo: api.PasswordKdfAlgo<
    "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow"
  >,
  params: {
    password: string;
    gb: BufferSource;
  },
) {
  const password = new TextEncoder().encode(params.password);
  const salt1 = tou8(algo.salt1);
  const salt2 = tou8(algo.salt2);
  const g = hybig(BigInt(algo.g));
  const p = hybig(algo.p);
  const a = hybig(rand_bigint(256));
  const ga = hybig(modpow(g.big, a.big, p.big));
  const gb = hybig(params.gb);
  const k = hybig(H(p.data, g.data));
  const u = hybig(H(ga.data, gb.data));
  const x = hybig(PH2(password, salt1, salt2));
  const v = hybig(modpow(g.big, x.big, p.big));
  const kv = (k.big * v.big) % p.big;
  let t = (gb.big - kv) % p.big;
  while (t < 0n) t += p.big;
  const sa = hybig(modpow(t, a.big + u.big * x.big, p.big));
  const ka = H(sa.data);
  const m1 = H(
    xor_array(H(p.data), H(g.data)),
    H(salt1),
    H(salt2),
    ga.data,
    gb.data,
    ka,
  );
  return { A: ga.data, M1: m1 };
}
