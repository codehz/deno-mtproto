const log = (tag: string, color: string) =>
  (template: TemplateStringsArray, ...objs: any) =>
    console.log(
      "[%c%s%c] %s",
      `color: ${color}; font-weight: bold`,
      tag,
      "",
      String.raw(template, ...objs),
    );

async function download_to_file(url: string, target: string) {
  log("DOWNLOAD", "yellow")`${url} -> ${target}`;
  const file = await Deno.open(target, { create: true, write: true });
  const resp = await fetch(url);
  await resp.body!.pipeTo(file.writable);
  log("DOWNLOAD", "green")`saved to ${target}`;
}

class MultiMap<K, V> {
  #map = new Map<K, V[]>();

  #get(key: K): V[] {
    let ret = this.#map.get(key);
    if (ret == null) {
      this.#map.set(key, ret = []);
    }
    return ret;
  }

  has(key: K): boolean {
    return this.#map.has(key);
  }

  add(key: K, value: V) {
    this.#get(key).push(value);
  }

  get(key: K) {
    return this.#map.get(key);
  }

  [Symbol.iterator]() {
    return this.#map.entries();
  }
}

async function find_errorjson() {
  const entry = "https://core.telegram.org/api/errors";
  log("CRAWELER", "yellow")`analyze ${entry}`;
  const page = await fetch(entry);
  const content = await page.text();
  const matched = content.match(/<a href="(.+?)">here »<\/a>/);
  if (matched == null) {
    throw new Error("cannot parse html");
  }
  const path = matched[1];
  const url = new URL(entry);
  url.pathname = path;
  log("CRAWELER", "green")`got url: ${url}`;
  log("DOWNLOAD", "green")`fetch ${url}`;
  const resp = await fetch(url);
  const data = await resp.json();
  const errors = data.errors as Record<string, Record<string, string[]>>;
  const output = new MultiMap<string, string>();
  for (const [, map] of Object.entries(errors)) {
    for (const [name, list] of Object.entries(map)) {
      for (const method of list) {
        output.add(method, name);
      }
    }
  }
  const result = JSON.stringify(Object.fromEntries(output));
  await Deno.writeTextFile("gen/errors.json", result);
}

await download_to_file("https://core.telegram.org/schema/json", "gen/api.json");
await find_errorjson();
