import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { liveProducts } from "../lib/products";

async function main() {
  const bad: string[] = [];
  const seen = new Set<string>();
  for (const p of liveProducts()) {
    const rel = p.image.replace(/^\//, "");
    if (seen.has(rel)) continue;
    seen.add(rel);
    const abs = path.join(process.cwd(), "public", rel);
    if (!existsSync(abs)) {
      bad.push(`MISSING ${p.slug} ${p.image}`);
      continue;
    }
    try {
      const meta = await sharp(abs).metadata();
      if (!meta.width || !meta.height) bad.push(`NO DIMS ${p.slug} ${p.image}`);
    } catch (err) {
      bad.push(`SHARP ${p.slug} ${p.image} ${err}`);
    }
  }
  const extra = ["prints/print-difficulty.png", "brand/bitcoin-b.svg", "brand/bitcoin-coin.svg"];
  for (const rel of extra) {
    const abs = path.join(process.cwd(), "public", rel);
    if (!existsSync(abs)) bad.push(`MISSING /${rel}`);
  }
  console.log("checked", seen.size, "bad", bad.length);
  for (const b of bad) console.log(b);
}

main();
