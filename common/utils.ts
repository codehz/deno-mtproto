import { Sha1 } from "std/hash/sha1.ts";
import { Sha256 } from "std/hash/sha256.ts";

export function rand_int(max: number) {
  return Math.random() * max | 0;
}

export function rand_bigint(length: number) {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return tobig(buf);
}

export function rand_array(length: number) {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf;
}

export function eq_array<T>(a: ArrayLike<T>, b: ArrayLike<T>) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

export function dump_u8arr(arr: Uint8Array) {
  let str = "";
  for (const ch of arr) {
    str += ch.toString(16).padStart(2, "0");
  }
  return str;
}

export function concat_array(...arrays: ArrayLike<number>[]) {
  const len = arrays.reduce((p, a) => p + a.length, 0);
  const ret = new Uint8Array(len);
  let off = 0;
  for (const arr of arrays) {
    ret.set(arr, off);
    off += arr.length;
  }
  return ret;
}

export function view_arr(array: Uint8Array, start: number, length?: number) {
  return array.subarray(start, length ? start + length : undefined);
}

export function xor_array(src: Uint8Array, rhs: Uint8Array, clone = false) {
  if (clone) src = src.slice(0);
  for (let i = 0; i < src.length; i++) {
    src[i] ^= rhs[i];
  }
  return src;
}

export function tou8(buffer: BufferSource): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer, 0, buffer.byteLength);
  } else {
    return new Uint8Array(buffer.buffer, buffer.byteOffset);
  }
}

export function todv(buffer: BufferSource): DataView {
  if (buffer instanceof ArrayBuffer) {
    return new DataView(buffer, 0, buffer.byteLength);
  } else {
    return new DataView(buffer.buffer, buffer.byteOffset);
  }
}

export function tobig(bytes: Iterable<number>, reversed = false) {
  let input = 0n;
  if (reversed) {
    let i = 0n;
    for (const byte of bytes) input |= BigInt(byte) << (i++ * 8n);
  } else {
    for (const byte of bytes) input = (input << 8n) | BigInt(byte);
  }
  return input;
}

export function frombig(value: bigint, reversed = false) {
  const result = [];
  while (value > 0) {
    if (reversed) {
      result.push(+BigInt.asUintN(8, value).toString());
    } else {
      result.unshift(+BigInt.asUintN(8, value).toString());
    }
    value >>= 8n;
  }
  return new Uint8Array(result);
}

export function frombig16(value: bigint, reversed = false) {
  const ret = new BigUint64Array(2);
  if (reversed) {
    ret[0] = value;
    ret[1] = value >> 64n;
  } else {
    ret[0] = value >> 64n;
    ret[1] = value;
  }
  return new Uint8Array(ret.buffer, ret.byteOffset);
}

export function frombig32(value: bigint, reversed = false) {
  const ret = new BigUint64Array(4);
  if (reversed) {
    ret[0] = value;
    ret[1] = value >> 64n;
    ret[2] = value >> 128n;
    ret[3] = value >> 192n;
  } else {
    ret[0] = value >> 192n;
    ret[1] = value >> 128n;
    ret[2] = value >> 64n;
    ret[3] = value;
  }
  return new Uint8Array(ret.buffer, ret.byteOffset);
}

export function frombig128(value: bigint, reversed = false) {
  const ret = new Uint8Array(128);
  const view = todv(ret);
  for (let i = 0; i < 16; i++) {
    if (reversed) {
      view.setBigUint64(8 * i, value >> (BigInt(i) * 64n));
    } else {
      view.setBigUint64(8 * i, value >> ((15n - BigInt(i)) * 64n));
    }
  }
  return ret;
}

export function frombig256(value: bigint, reversed = false) {
  const ret = new Uint8Array(256);
  const view = todv(ret);
  for (let i = 0; i < 32; i++) {
    if (reversed) {
      view.setBigUint64(8 * i, value >> (BigInt(i) * 64n));
    } else {
      view.setBigUint64(8 * i, value >> ((31n - BigInt(i)) * 64n));
    }
  }
  return ret;
}

export function sha256(...datas: BufferSource[]) {
  const ins = new Sha256(false, true);
  for (const data of datas) ins.update(tou8(data));
  return tou8(ins.arrayBuffer());
}

export function sha1(...datas: (BufferSource | number[])[]) {
  const ins = new Sha1(true);
  for (const data of datas) {
    if (Array.isArray(data)) {
      ins.update(new Uint8Array(data));
    } else {
      ins.update(tou8(data));
    }
  }
  return tou8(ins.arrayBuffer());
}
