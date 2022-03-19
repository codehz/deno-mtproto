import type {
  EnvironmentInformation,
  InitDC,
  MTProtoOptions,
  TransportFactory,
} from "mtproto/types.ts";
import RPC from "mtproto/rpc/mod.ts";
import type api from "mtproto/gen/api.js";
import {
  DCIdentifier,
  DCType,
  toDCIdentifier,
  toDCInfo,
} from "mtproto/common/dc.ts";
import type { MTStorage } from "mtproto/storage/types.ts";
import KVStorageAdapter from "mtproto/storage/kv.ts";

const testdc: InitDC = {
  test: true,
  id: 1,
  ip: "149.154.175.10",
  port: 443,
};

export default class MTProto {
  #api_id: number;
  #api_hash: string;
  #initdc: InitDC;
  #transport_factory: TransportFactory;
  #storage: MTStorage;
  #environment: EnvironmentInformation;
  #connections = new Map<DCIdentifier, RPC>();
  #dclist: api.DcOption[] = [];

  constructor(
    {
      api_id,
      api_hash,
      initdc = testdc,
      transport_factory,
      environment,
      storage = new KVStorageAdapter(),
    }: MTProtoOptions,
  ) {
    this.#api_id = api_id;
    this.#api_hash = api_hash;
    this.#initdc = initdc;
    this.#transport_factory = transport_factory;
    this.#storage = storage;
    this.#environment = environment;
    this.#dclist.push({
      _: "dcOption",
      id: initdc.id,
      ip_address: initdc.ip,
      port: initdc.port,
    });
  }

  async init() {
    const rpc = await this.rpc();
    const config = (await rpc.api.help.getConfig()).unwrap();
    this.#dclist = config.dc_options;
  }

  getDcId(id: number, type: DCType = "main") {
    return toDCIdentifier({
      id,
      type,
      test: this.#initdc.test,
    });
  }

  async rpc(dcid: DCIdentifier = this.getDcId(this.#initdc.id)): Promise<RPC> {
    if (this.#connections.has(dcid)) {
      return this.#connections.get(dcid)!;
    }
    const { type, id: nid } = toDCInfo(dcid);
    let found = this.#dclist.find(({ cdn, media_only, id }) => {
      if (id != nid) return false;
      if (type == "cdn") return cdn;
      if (type == "media") return media_only;
      return true;
    });
    if (found) {
      const connection = await this.#transport_factory(
        found.ip_address,
        found.port,
      );
      const rpc = new RPC(
        connection,
        this.#storage.get({ _: "dc", ...toDCInfo(dcid) }),
        dcid,
        this.#api_id,
        this.#api_hash,
        this.#environment,
      );
      this.#connections.set(dcid, rpc);
      return rpc;
    }
    throw new Error(`Unknown DC ${dcid}`);
  }
}
