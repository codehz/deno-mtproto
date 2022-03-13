import { ToUnderscore } from "mtproto/tl/types.ts";

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
  encode_packet(data: Uint8Array): Iterable<Uint8Array>;
  read_packet(reader: Deno.Reader): AsyncIterable<Uint8Array>;
}

export type TransportFactory = (ip: string, port: number) => Promise<Transport>;

export type DCIdentifier<
  T extends "prod" | "test" | "testmedia" | "prodmedia" | "cdn" =
    | "prod"
    | "test"
    | "testmedia"
    | "prodmedia"
    | "cdn",
> = `${T}-${number}`;

export interface InitDC {
  id: DCIdentifier<"prod" | "test">;
  ip: string;
  port: number;
}

export type KVStorage = {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
};

export interface EnvironmentInformation {
  device_model: string;
  system_version: string;
  app_version: string;
}

export interface MTProtoOptions {
  api_id: number;
  api_hash: bigint;
  environment: EnvironmentInformation;
  initdc?: InitDC;
  transport_factory: TransportFactory;
  storage?: KVStorage;
}
