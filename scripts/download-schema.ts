import { wait } from "https://deno.land/x/wait@0.1.12/mod.ts";

async function download(url: string, target: string) {
  const indicator = wait({ text: `Downloading ${url} to ${target}` }).start();
  const file = await Deno.open(target, { create: true, write: true });
  try {
    const resp = await fetch(url);
    await resp.body!.pipeTo(file.writable);
    indicator.stopAndPersist({ text: `Downloaded ${target}` });
  } catch (e) {
    indicator.fail(`Failed to download ${url}`);
    throw e;
  }
}

await download("https://core.telegram.org/schema/json", "gen/api.json");
