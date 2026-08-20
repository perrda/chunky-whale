/**
 * Bleach grainy studio backdrops to pure white.
 * Skips cream / white garments so flood cannot eat Bone cloth or totes.
 */
import { readdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { garmentLightness, markBackground } from "../lib/recolor-garment";

const DIR = path.join(process.cwd(), "public/products");

async function clean(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const bg = markBackground(data, w, h);
  const l = garmentLightness(data, w, h);
  if (l > 0.55) return { file, skipped: "light-garment" };

  let kept = 0;
  let changed = 0;
  const out = Buffer.from(data);
  for (let i = 0; i < w * h; i++) {
    if (!bg[i]) {
      kept += 1;
      continue;
    }
    const o = i * 4;
    if (out[o] !== 255 || out[o + 1] !== 255 || out[o + 2] !== 255) changed += 1;
    out[o] = 255;
    out[o + 1] = 255;
    out[o + 2] = 255;
    out[o + 3] = 255;
  }
  if (kept < w * h * 0.08) return { file, skipped: "too-little-product" };
  if (changed < 80) return { file, skipped: "already-white" };
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
  return { file: path.basename(file), kept: Number((kept / (w * h)).toFixed(3)), changed, l: Number(l.toFixed(2)) };
}

async function main() {
  const only = process.argv.slice(2);
  const names = readdirSync(DIR).filter((n) => n.endsWith(".png"));
  let cleaned = 0;
  let skipped = 0;
  for (const name of names) {
    if (only.length && !only.includes(name) && !only.includes(name.replace(/\.png$/, ""))) continue;
    const result = await clean(path.join(DIR, name));
    if ("skipped" in result) {
      skipped += 1;
      continue;
    }
    cleaned += 1;
    console.log(result);
  }
  console.log({ cleaned, skipped });
}

main();
