const idmap = {
  1: "pluto",
  2: "venus",
  3: "aurora",
  4: "vesta",
  5: "flora",
} as Record<number, string>;

export type AddressOption = {
  websocket?: boolean;
  tls?: boolean;
  cors?: boolean;
  test?: boolean;
};

export function get_address(dc: number, {
  websocket,
  tls,
  cors,
  test,
}: AddressOption) {
  let address;
  if (websocket) {
    address = tls ? "wss://" : "ws://";
  } else {
    address = tls ? "https://" : "http://";
  }
  address += idmap[dc] + ".web.telegram.org/api";
  if (cors) address += "w";
  if (websocket) address += "s";
  if (test) address += "_test";
  return address;
}
