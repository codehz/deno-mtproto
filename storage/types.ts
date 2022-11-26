import type { ToUnderscore } from "../common/magic.ts";
import { type DCInfo, toDCIdentifier } from "../common/dc.ts";

type StorageKinds = {
  // deno-lint-ignore ban-types
  global: {};
  dc: DCInfo;
};

export type StorageKind<
  K extends keyof StorageKinds = keyof StorageKinds,
> = ToUnderscore<StorageKinds, K>;

export interface KVStorage {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
  [Symbol.iterator](): IterableIterator<[string, string]>;
}

export interface MTStorage {
  get(kind: StorageKind): KVStorage;
  reset(kind: StorageKind): void;
}

export function serialize_storage_kind(kind: StorageKind): string {
  if (kind._ == "global") return "";
  return toDCIdentifier(kind);
}
