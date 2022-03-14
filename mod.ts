import {
  DCIdentifier,
  EnvironmentInformation,
  InitDC,
  KVStorage,
  MTProtoOptions,
  TransportFactory,
} from "mtproto/types.ts";
import RPC from "mtproto/rpc/mod.ts";
import api, { help } from "mtproto/gen/api.js";

const testdc: InitDC = {
  id: "test-1",
  ip: "149.154.175.10",
  port: 443,
};

function parseDcId(
  id: DCIdentifier,
): { type: "test" | "prod" | "media" | "cdn"; id: number } {
  const [type, idstr] = id.split("-");
  // @ts-ignore
  return { type, id: +idstr };
}

export default class MTProto {
  #api_id: number;
  #api_hash: string;
  #initdc: InitDC;
  #transport_factory: TransportFactory;
  #storage: KVStorage;
  #environment: EnvironmentInformation;
  #connections = new Map<DCIdentifier, RPC>();
  #initconn?: RPC;
  #dclist: api.DcOption[] = [];

  constructor(
    {
      api_id,
      api_hash,
      initdc = testdc,
      transport_factory,
      environment,
      storage = new Map(),
    }: MTProtoOptions,
  ) {
    this.#api_id = api_id;
    this.#api_hash = api_hash;
    this.#initdc = initdc;
    this.#transport_factory = transport_factory;
    this.#storage = storage;
    this.#environment = environment;
  }

  async init() {
    const rpc = await this.rpc();
    // const config = await rpc.call(help.getConfig);
  }

  async rpc(dcid?: DCIdentifier): Promise<RPC> {
    if (dcid == null) {
      if (this.#initconn) return this.#initconn;
      const connection = await this.#transport_factory(
        this.#initdc.ip,
        this.#initdc.port,
      );
      this.#initconn = new RPC(
        connection,
        this.#storage,
        this.#initdc.id,
        this.#api_id,
        this.#api_hash,
        this.#environment,
      );
      return this.#initconn;
    }
    if (this.#connections.has(dcid)) {
      return this.#connections.get(dcid)!;
    }
    const { type, id: nid } = parseDcId(dcid);
    let found = this.#dclist.find(({ cdn, media_only, id }) => {
      if (type == "cdn") return cdn && id == nid;
      if (type == "media") return media_only && id == nid;
      return id == nid;
    });
    if (found) {
      const connection = await this.#transport_factory(
        found.ip_address,
        found.port,
      );
      const rpc = new RPC(
        connection,
        this.#storage,
        this.#initdc.id,
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
