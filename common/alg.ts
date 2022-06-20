const wasmcode =
  `data:application/wasm;base64,AGFzbQEAAAABBwFgAn5+AX4DAgEABQMBAAAHEAIDZ2NkAAAGbWVtb3J5AgAKJAEiAQF+A0AgAUIAUgRAIAAgAYIhAiABIQAgAiEBDAELCyAACw`;
const { instance: { exports } } = await WebAssembly.instantiateStreaming(
  fetch(wasmcode),
);
export const gcd = exports.gcd as (a: bigint, b: bigint) => bigint;

export function modpow(a: bigint, b: bigint, n: bigint): bigint {
  a %= n;
  let result = 1n;
  let x = a;
  while (b > 0n) {
    const lsb = b % 2n;
    b /= 2n;
    if (lsb == 1n) {
      result *= x;
      result %= n;
    }
    x *= x;
    x %= n;
  }
  return result;
}

export function min(a: bigint, b: bigint) {
  return a < b ? a : b;
}

export function max(a: bigint, b: bigint) {
  return a > b ? a : b;
}

export function abs(v: bigint) {
  return v < 0n ? -v : v;
}
