import {
  KVStorage,
  MTStorage,
  serialize_storage_kind,
  StorageKind,
} from "./types.ts";

export default class KVStorageAdapter implements MTStorage {
  constructor(public data: KVStorage = new Map()) {}

  get(kind: StorageKind): KVStorage {
    const prefix = serialize_storage_kind(kind);
    const data = this.data;
    return {
      get(key) {
        return data.get(`${prefix}$${key}`);
      },
      set(key, value) {
        data.set(`${prefix}$${key}`, value);
      },
      delete(key) {
        data.delete(`${prefix}$${key}`);
      },
      *[Symbol.iterator]() {
        for (const [k, v] of data) {
          if (k.startsWith(prefix + "$")) {
            yield [k.substring(prefix.length + 1), v];
          }
        }
      },
    };
  }
  reset(kind: StorageKind): void {
    const prefix = serialize_storage_kind(kind);
    const list: string[] = [];
    for (const [k] of this.data) {
      if (k.startsWith(prefix + "$")) {
        list.push(k);
      }
    }
    for (const item of list) this.data.delete(item);
  }
}
