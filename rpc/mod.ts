import {
  DCIdentifier,
  EnvironmentInformation,
  KVStorage,
  Transport,
} from "mtproto/types.ts";
import { TLApiMethod, TLMethod } from "mtproto/tl/types.ts";
import { initConnection, invokeWithLayer, mt } from "mtproto/gen/api.js";
import {
  concat_array,
  eq_array,
  frombig,
  sha1,
  sha256,
  view_arr,
} from "mtproto/common/utils.ts";
import * as aes from "mtproto/crypto/aes.ts";
import { serialize } from "mtproto/tl/serializer.ts";
import { Deserializer } from "mtproto/tl/deserializer.ts";
import { rand_array, rand_bigint, rand_int } from "mtproto/common/utils.ts";
import { max } from "mtproto/common/alg.ts";
import { decode as debase64, encode as base64 } from "std/encoding/base64.ts";
import authorize from "mtproto/rpc/authorizor.ts";
import { decompressObject } from "mtproto/common/gzip.ts";

export type RPCState = "connecting" | "connected" | "disconnected";

class Session {
  #seq = 0;
  #session = 0n;
  #lastmsgid = 0n;
  #offset = 0;
  #first = true;

  constructor() {
    this.reset();
  }

  set offset(value: number) {
    this.#offset = value;
  }

  get first() {
    const ret = this.#first;
    this.#first = false;
    return ret;
  }

  reset() {
    this.#seq = 0;
    this.#session = rand_bigint(8);
    this.#lastmsgid = 0n;
    this.#first = true;
  }

  get related_seq() {
    return this.#seq++ * 2 + 1;
  }

  get unrelated_seq() {
    return this.#seq * 2;
  }

  get id() {
    return this.#session;
  }

  get msgid() {
    const timeTicks = Date.now();
    const timeSec = Math.floor(timeTicks / 1000) + this.#offset;
    const timeMSec = timeTicks % 1000;
    const random = rand_int(0xffff);

    return this.#lastmsgid = max(
      this.#lastmsgid + 4n,
      (BigInt(timeSec) << 32n) | (BigInt(timeMSec) << 21n) |
        (BigInt(random) << 3n) | 4n,
    );
  }
}

interface PendingCall<N extends string = string, T = any, R = any> {
  method: TLApiMethod<N, T, R>;
  params: Omit<T, "api_id" | "api_hash">;
  resolve: (result: R) => void;
  reject: (error: any) => void;
}

interface PendingResquest<T = any> {
  resolve: (result: T) => void;
  reject: (error: any) => void;
  packet: Uint8Array;
  ack?: true;
}

class QueueHandler<T> {
  #handler: (t: T[]) => Promise<void>;
  #errhandler: (err: any) => void;
  #queue: T[] = [];
  #blocked: boolean = true;
  #next: number | undefined;

  constructor(
    handler: (t: T[]) => Promise<void>,
    errhandler: (err: any) => void,
    blocked = true,
  ) {
    this.#handler = handler;
    this.#errhandler = errhandler;
    this.blocked = blocked;
  }

  [Symbol.iterator]() {
    return this.#queue[Symbol.iterator]();
  }

  set blocked(value: boolean) {
    this.#blocked = value;
    if (!value) {
      if (this.#queue.length) {
        this.#handler(this.#queue).catch(this.#errhandler);
      }
    } else {
      if (this.#next) clearTimeout(this.#next);
      this.#next = undefined;
    }
  }

  push(item: T) {
    this.#queue.push(item);
    if (this.#next == undefined && !this.#blocked) {
      this.#next = setTimeout(() =>
        this.#handler(this.#queue).catch(this.#errhandler)
      );
    }
  }
}

export default class RPC {
  #api_id: number;
  #api_hash: bigint;
  #environment_information: EnvironmentInformation;
  #dcid: DCIdentifier;
  #transport: Transport;
  #storage: KVStorage;
  #auth!: Uint8Array;
  #salt!: Uint8Array;
  #state: RPCState = "connecting";
  #handle?: (this: RPC, data: Uint8Array) => Promise<void>;
  #session = new Session();
  #waitlist = new Map<bigint, PendingResquest>();

  #handleerr = (e: any) => {
    console.error(new Error(e, { cause: e }));
    this.close(e);
  };

  #ack_queue = new QueueHandler<bigint>(async (msg_ids) => {
    const packet = serialize(mt.msgs_ack, { msg_ids });
    msg_ids.length = 0;
    await this.#send_encrypted(packet, { content_related: false });
  }, this.#handleerr);
  #pending_calls = new QueueHandler<PendingCall>(
    async (list) => {
      const { method, params, resolve, reject } = list.shift()!;
      const packet = serialize(invokeWithLayer, {
        layer: 138,
        query: initConnection({
          ...this.#environment_information,
          api_id: this.#api_id,
          lang_code: "en",
          lang_pack: "",
          system_lang_code: "en",
          query: method({
            ...params,
            api_id: this.#api_id,
            api_hash: this.#api_hash,
          }),
        }),
      });
      const msgid = await this.#send_encrypted(packet);
      console.log("sent", msgid);
      this.#waitlist.set(msgid, { resolve, reject, packet });
    },
    this.#handleerr,
  );

  get state() {
    return this.#state;
  }

  constructor(
    transport: Transport,
    storage: KVStorage,
    dcid: DCIdentifier,
    api_id: number,
    api_hash: bigint,
    environment_information: EnvironmentInformation,
  ) {
    this.#transport = transport;
    this.#storage = storage;
    this.#dcid = dcid;
    this.#api_id = api_id;
    this.#api_hash = api_hash;
    this.#environment_information = environment_information;
    this.#recv_loop();
    this.#connect().catch(this.#handleerr);
  }

  close(e?: any) {
    if (this.#state == "disconnected") return;
    this.#state = "disconnected";
    this.#transport.close();
    this.#ack_queue.blocked = true;
    this.#pending_calls.blocked = true;
    const suberror = new Error("rpc failed", { cause: e });
    for (const { reject } of this.#pending_calls) {
      reject(suberror);
    }
    for (const [, { reject }] of this.#waitlist) {
      reject(suberror);
    }
  }

  #setitem(key: string, value: string | undefined) {
    if (value != null) {
      this.#storage.set(`${this.#dcid}-${key}`, value);
    } else {
      this.#storage.delete(`${this.#dcid}-${key}`);
    }
  }

  #getitem(key: string) {
    return this.#storage.get(`${this.#dcid}-${key}`);
  }

  async #recv_loop() {
    try {
      for await (const event of this.#transport) {
        switch (event._) {
          case "error":
            await this.#error(event.code);
            break;
          case "message":
            if (this.#handle == null) throw new Error("no message handler");
            await this.#handle(event.data);
            break;
        }
      }
      if (this.#state != "disconnected") {
        this.#handleerr("connection ended");
      }
    } catch (e) {
      this.#handleerr(e);
    }
  }

  async #connect() {
    const auth = this.#getitem("auth");
    const salt = this.#getitem("salt");
    if (auth == null || salt == null) {
      await this.#do_auth();
    } else {
      this.#auth = debase64(auth);
      this.#salt = debase64(salt);
    }
    this.#handle = this.#handle_encrypted;
    this.#state = "connected";
    this.#pending_calls.blocked = false;
    this.#ack_queue.blocked = false;
  }

  #aes_instance(msgkey: Uint8Array, decrypt: boolean) {
    const x = decrypt ? 8 : 0;
    const a = sha256(msgkey, view_arr(this.#auth, x, 36));
    const b = sha256(view_arr(this.#auth, x + 40, 36), msgkey);
    const key = concat_array(
      a.subarray(0, 8),
      view_arr(b, 8, 16),
      view_arr(a, 24, 8),
    );
    const iv = concat_array(
      b.subarray(0, 8),
      view_arr(a, 8, 16),
      view_arr(b, 24, 8),
    );
    return new aes.IGE(key, iv);
  }

  #aes_decrypt(msgkey: Uint8Array, data: Uint8Array) {
    return this.#aes_instance(msgkey, true).decrypt(data);
  }

  #aes_encrypt(msgkey: Uint8Array, data: Uint8Array) {
    return this.#aes_instance(msgkey, false).encrypt(data);
  }

  async call<N extends string, R>(
    method: TLApiMethod<N, void, R>,
  ): Promise<R>;
  async call<N extends string, T, R>(
    method: TLApiMethod<N, T, R>,
    params: Omit<T, "api_id" | "api_hash">,
  ): Promise<R>;
  async call<N extends string, T, R>(
    method: TLApiMethod<N, T, R>,
    params: T extends void ? void : Omit<T, "api_id" | "api_hash">,
  ): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.#pending_calls.push({
        method,
        params: params ?? {},
        resolve,
        reject,
      });
    });
  }

  async #send_encrypted(
    data: Uint8Array,
    {
      content_related = true,
      msgid = this.#session.msgid,
    }: {
      content_related?: boolean;
      msgid?: bigint;
    } = {},
  ) {
    const salt = this.#salt;
    const seqno = content_related
      ? this.#session.related_seq
      : this.#session.unrelated_seq;
    const minpadding = 12;
    const unpadded = (32 + data.length + minpadding) % 16;
    const padded = minpadding + (unpadded ? 16 - unpadded : 0);
    const session_id = this.#session.id;
    const padding = rand_array(padded);
    const payload = serialize(function () {
      this.raw(salt);
      this.int64(session_id);
      this.int64(msgid);
      this.int32(seqno);
      this.uint32(data.length);
      this.raw(data);
      this.raw(padding);
    });
    const msgkey = view_arr(
      sha256(view_arr(this.#auth, 88, 32), payload),
      8,
      16,
    );
    const encrypted = this.#aes_encrypt(msgkey, payload);
    const authkeyid = sha1(this.#auth).subarray(-8);
    const packet = concat_array(authkeyid, msgkey, encrypted);
    await this.#transport.send(packet);
    return msgid;
  }

  async #handle_encrypted(buffer: Uint8Array) {
    try {
      const deserializer = new Deserializer(buffer);
      deserializer.int64(); // auth key
      const msgkey = deserializer.int128();
      const encrypted_payload = deserializer.remain;
      const decrypted_payload = this.#aes_decrypt(
        msgkey,
        encrypted_payload.subarray(
          0,
          encrypted_payload.length - encrypted_payload.length % 16,
        ),
      );
      const computed_msgkey = view_arr(
        sha256(view_arr(this.#auth, 96, 32), decrypted_payload),
        8,
        16,
      );
      if (!eq_array(msgkey, computed_msgkey)) {
        throw new Error(`Incorrect msgkey`);
      }
      const plain_deserializer = new Deserializer(decrypted_payload);
      plain_deserializer.int64(); // salt
      plain_deserializer.int64(); // session
      const msgid = plain_deserializer.int64();
      if (msgid % 2n == 0n) {
        throw new Error(`Got even message`);
      }
      plain_deserializer.uint32(); // seqno
      const length = plain_deserializer.uint32();
      if (length > decrypted_payload.length || length % 4 != 0) {
        throw new Error(`Invalid message length`);
      }
      return await this.#process_message(plain_deserializer.object(), msgid);
    } catch (e) {
      this.#handleerr(e);
    }
  }

  async #process_message(
    data:
      | mt.MessageContainer
      | mt.BadMsgNotification
      | mt.NewSession
      | mt.MsgsAck
      | mt.RpcResult
      | mt.Object
      | mt.Pong,
    msgid: bigint,
  ): Promise<void> {
    switch (data._) {
      case "mt.pong":
        break;
      case "mt.gzip_packed":
        return this.#process_message(decompressObject(data.packed_data), msgid);
      case "mt.msg_container":
        for (const msg of data.messages) {
          await this.#process_message(msg.body, msg.msg_id);
        }
        break;
      case "mt.msgs_ack":
        for (const id of data.msg_ids) {
          const msg = this.#waitlist.get(id);
          if (!msg) {
            console.warn(`Ack message ${id} not in list`);
            continue;
          }
          msg.ack = true;
        }
        break;
      case "mt.new_session_created":
        this.#ack_queue.push(msgid);
        this.#setitem(
          "salt",
          base64(this.#salt = frombig(data.server_salt, true)),
        );
        break;
      case "mt.rpc_result": {
        this.#ack_queue.push(msgid);
        const msg = this.#waitlist.get(data.req_msg_id);
        if (!msg) {
          console.warn(`Result message ${data.req_msg_id} not in list`);
          break;
        }
        const res = decompressObject(data.result.packed_data);
        if (typeof res == "object" && res._ == "mt.rpc_error") {
          const { error_code, error_message } = res as mt.RpcError;
          msg.reject(new Error(`rpc error(${error_code}): ${error_message}`));
        } else {
          msg.resolve(res);
        }
        this.#waitlist.delete(data.req_msg_id);
        break;
      }
      case "mt.bad_server_salt":
        this.#setitem(
          "salt",
          base64(this.#salt = frombig(data.new_server_salt, true)),
        );
        await this.#resend_packet(data.bad_msg_id);
        break;
      case "mt.bad_msg_notification":
        if ([16, 17].includes(data.error_code)) {
          const server_time = +(msgid >> 32n).toString();
          const offset = (Date.now() / 1000) - server_time;
          this.#setitem("time_offset", (this.#session.offset = offset) + "");
          await this.#resend_packet(data.bad_msg_id);
          break;
        }
        // TODO: Better handling
        {
          const msg = this.#waitlist.get(data.bad_msg_id);
          if (msg) {
            msg.reject(new Error(`reject due to ${data.error_code}`));
            this.#waitlist.delete(data.bad_msg_id);
          }
        }
        break;
    }
    this.#ack_queue.push(msgid);
    console.log(data);
  }

  async #resend_packet(msgid: bigint) {
    const msg = this.#waitlist.get(msgid);
    if (msg) {
      await this.#send_encrypted(msg.packet, { msgid });
    }
  }

  async #do_auth() {
    const { auth, salt } = await authorize({
      send: <T, R>(fn: TLMethod<T, R>, value: T): Promise<R> => {
        const data = serialize(fn, value);
        const msgid = this.#session.msgid;
        const payload = serialize(function () {
          this.int64(0n);
          this.int64(msgid);
          this.uint32(data.length);
          this.raw(data);
        });
        return new Promise((resolve, reject) => {
          this.#transport.send(payload).catch(reject);
          this.#handle = async function (data) {
            this.#handle = undefined;
            try {
              const deserializer = new Deserializer(data);
              deserializer.int64();
              deserializer.int64();
              deserializer.int32();
              resolve(fn.verify(deserializer.object()));
            } catch (e) {
              reject(e);
            }
          };
        });
      },
      set_timeoffset: (offset) => {
        this.#setitem(
          "time_offset",
          (this.#session.offset = offset).toString(),
        );
      },
    });
    this.#setitem("auth", base64(this.#auth = auth));
    this.#setitem("salt", base64(this.#salt = salt));
  }

  async #error(code: number) {
    switch (code) {
      case 404:
        this.#setitem("auth", undefined);
        this.#setitem("salt", undefined);
        throw new Error("sent invalid packet");
      case 429:
        throw new Error("transport flood");
      default:
        throw new Error(`unknown error ${code}`);
    }
  }
}
