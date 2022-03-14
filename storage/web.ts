import KVStorageAdapter from "./kv.ts";
import type { MTStorage } from "./types.ts";

export default class WebStorageAdapter extends KVStorageAdapter
  implements MTStorage {
  constructor(storage: Storage = localStorage) {
    super({
      get(key) {
        return storage.getItem(key) ?? undefined;
      },
      set(key, value) {
        storage.setItem(key, value);
      },
      delete(key) {
        storage.removeItem(key);
      },
      *[Symbol.iterator]() {
        for (const k in localStorage) yield [k, storage.getItem(k)!];
      },
    });
  }
}
