import type {
  EnvironmentInformation,
  InitDC,
  IPv6Policy,
  MTProtoOptions,
  TransportFactory,
} from "./types.ts";
import RPC from "./rpc/mod.ts";
import type api from "./gen/api.js";
import { DCIdentifier, DCType, toDCIdentifier, toDCInfo } from "./common/dc.ts";
import type { MTStorage } from "./storage/types.ts";
import KVStorageAdapter from "./storage/kv.ts";

const testdc: InitDC = {
  test: true,
  id: 1,
  ip: "149.154.175.10",
  port: 443,
};

function toInitDC(dc: api.DcOption, test: boolean): InitDC {
  return {
    id: dc.id,
    ip: dc.ip_address,
    port: dc.port,
    test,
  };
}

export default class MTProto {
  #api_id: number;
  #api_hash: string;
  #initdc: InitDC;
  #transport_factory: TransportFactory;
  #storage: MTStorage;
  #environment: EnvironmentInformation;
  #connections = new Map<DCIdentifier, RPC>();
  #dclist: api.DcOption[] = [];
  #ipv6: IPv6Policy;
  setup_rpc?: (rpc: RPC) => void;

  #setting_get(key: string) {
    return this.#storage.get({ _: "global" }).get(key);
  }

  #setting_put(key: string, value: string | undefined) {
    const view = this.#storage.get({ _: "global" });
    if (value == null) {
      view.delete(key);
    } else {
      view.set(key, value);
    }
  }

  constructor({
    api_id,
    api_hash,
    initdc,
    transport_factory,
    environment,
    storage = new KVStorageAdapter(),
    ipv6_policy = "both",
    setup_rpc,
  }: MTProtoOptions) {
    this.#api_id = api_id;
    this.#api_hash = api_hash;
    this.#storage = storage;
    const defaultdc = this.#setting_get("dc");
    if (defaultdc) {
      this.#initdc = JSON.parse(defaultdc);
    } else {
      this.#initdc = initdc ?? testdc;
    }
    this.#transport_factory = transport_factory;
    this.#environment = environment;
    this.#dclist.push({
      _: "dcOption",
      id: this.#initdc.id,
      ip_address: this.#initdc.ip,
      port: this.#initdc.port,
    });
    this.#ipv6 = ipv6_policy;
    this.setup_rpc = setup_rpc;
  }

  async init() {
    const rpc = await this.rpc();
    const config = await rpc.api.help.getConfig();
    this.#dclist = config.dc_options;
  }

  set default_dc(dcid: number) {
    const founds = this.#dclist.filter(
      ({ cdn, media_only, id, ipv6, tcpo_only }) => {
        if (id != dcid || tcpo_only) return false;
        if (this.#ipv6 == "ipv4" && ipv6) return false;
        if (this.#ipv6 == "ipv6" && !ipv6) return false;
        return !cdn && !media_only;
      }
    );
    if (founds.length) {
      const { id, ip_address, port } = founds[0];
      this.#initdc.id = id;
      this.#initdc.ip = ip_address;
      this.#initdc.port = port;
      this.#setting_put("dc", JSON.stringify(this.#initdc));
    } else {
      throw new Error("dc not found!");
    }
  }

  get default_dc() {
    return this.#initdc.id;
  }

  get_dc_id(id: number, type: DCType = "main") {
    return toDCIdentifier({
      id,
      type,
      test: this.#initdc.test,
    });
  }

  async rpc(
    dcid: DCIdentifier = this.get_dc_id(this.default_dc)
  ): Promise<RPC> {
    if (this.#connections.has(dcid)) {
      return this.#connections.get(dcid)!;
    }
    const { type, id: nid } = toDCInfo(dcid);
    const founds = this.#dclist.filter(
      ({ cdn, media_only, id, ipv6, tcpo_only }) => {
        if (id != nid || tcpo_only) return false;
        if (this.#ipv6 == "ipv4" && ipv6) return false;
        if (this.#ipv6 == "ipv6" && !ipv6) return false;
        if (type == "cdn") return cdn;
        if (type == "media") return media_only;
        return true;
      }
    );
    let lasterr: Error | undefined;
    for (const found of founds) {
      try {
        const connection = await this.#transport_factory(
          toInitDC(found, this.#initdc.test)
        );
        const rpc = new RPC(
          connection,
          this.#storage.get({ _: "dc", ...toDCInfo(dcid) }),
          dcid,
          this.#api_id,
          this.#api_hash,
          this.#environment
        );
        rpc.once("terminate", () => this.#connections.delete(dcid));
        this.#connections.set(dcid, rpc);
        this.setup_rpc?.(rpc);
        return rpc;
      } catch (e) {
        lasterr = e;
      }
    }
    throw lasterr ?? new Error(`Unknown DC ${dcid}`);
  }

  async shutdown() {
    const conns = [...this.#connections.values()];
    this.#connections.clear();
    return await Promise.all(conns.map((conn) => conn.close("closed")));
  }
}
