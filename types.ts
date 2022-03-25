import type { ToUnderscore } from "mtproto/tl/types.ts";
import type { MTStorage } from "mtproto/storage/types.ts";
import type RPC from "./rpc/mod.ts";

export type TransportEvents = {
  error: { code: number };
  message: { data: Uint8Array };
};

export type TransportEvent<
  K extends keyof TransportEvents = keyof TransportEvents,
> = ToUnderscore<TransportEvents, K>;

export interface Transport extends Deno.Closer {
  send(packet: Uint8Array): Promise<void>;
  [Symbol.asyncIterator](): AsyncIterator<TransportEvent>;
}

export interface PacketCodec {
  readonly init?: Uint8Array;
  readonly obfuscate_tag?: Uint8Array;
  readonly obfuscated?: true;
  encode_packet(data: Uint8Array): Iterable<Uint8Array>;
  read_packet(reader: Deno.Reader): AsyncIterable<Uint8Array>;
}

export type TransportFactory = (ip: string, port: number) => Promise<Transport>;

export interface InitDC {
  test: boolean;
  id: number;
  ip: string;
  port: number;
}

export interface EnvironmentInformation {
  device_model: string;
  system_version: string;
  app_version: string;
}

export type IPv6Policy = "ipv4" | "ipv6" | "both";

export interface MTProtoOptions {
  api_id: number;
  api_hash: string;
  environment: EnvironmentInformation;
  initdc?: InitDC;
  transport_factory: TransportFactory;
  storage?: MTStorage;
  ipv6_policy?: IPv6Policy;
  setup_rpc?: (rpc: RPC) => void;
}
