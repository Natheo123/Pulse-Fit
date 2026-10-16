/**
 * Download all catalog exercise MP4s into /videos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/data/exercises.catalog.json"), "utf8")
);
const outDir = path.join(root, "videos");
fs.mkdirSync(outDir, { recursive: true });

const items = catalog.filter((e) => e.demoVideo);
const CONCURRENCY = 8;

let done = 0;
let skipped = 0;
let failed = 0;

async function downloadOne(ex) {
  const dest = path.join(outDir, `${ex.id}.mp4`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
    skipped++;
    done++;
    return;
  }
  try {
    const res = await fetch(ex.demoVideo, {
      headers: { "User-Agent": "PulseFit/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(dest, buf);
    done++;
    if (done % 20 === 0 || done === items.length) {
      console.log(`${done}/${items.length} (skip ${skipped}, fail ${failed})`);
    }
  } catch (err) {
    failed++;
    done++;
    console.warn(`FAIL ${ex.id}: ${err.message}`);
  }
}

async function run() {
  console.log(`Downloading ${items.length} videos → ${outDir}`);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await downloadOne(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`Done. ok=${items.length - failed - skipped} skip=${skipped} fail=${failed}`);
  console.log(`Folder: ${outDir}`);
}

run();
