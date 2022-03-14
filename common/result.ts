type ResultT<T, E> =
  | {
    ok: true;
    value: T;
  }
  | (E extends never ? never : {
    ok: false;
    error: E;
  });

export class UnwrapError<E> extends Error {
  constructor(public value: E) {
    super("unwrap error");
  }
}

type Prototype = {
  unwrap<T, E>(this: ResultT<T, E>): T;
  unwrap_or<T, E>(this: ResultT<T, E>, alt: T): T;
  map<T, E, R>(this: ResultT<T, E>, fn: (input: T) => R): Result<R, E>;
  map_err<T, E, R>(this: ResultT<T, E>, fn: (input: E) => R): Result<T, R>;
};

const prototype: Prototype = {
  unwrap() {
    if (this.ok) return this.value;
    throw new UnwrapError(this.error);
  },

  unwrap_or(alt) {
    if (this.ok) return this.value;
    return alt;
  },

  map(fn) {
    if (this.ok) return ok(fn(this.value));
    return this as any;
  },

  map_err(fn) {
    if (!this.ok) return err(fn(this.error));
    return this as any;
  },
};

Object.freeze(prototype);

export type Result<T, E> = ResultT<T, E> & Prototype;

export function ok<T, E>(value: T): Result<T, E> {
  return Object.assign(Object.create(prototype), { ok: true, value });
}

export function err<T, E>(error: E): Result<T, E> {
  return Object.assign(Object.create(prototype), { ok: false, error });
}
