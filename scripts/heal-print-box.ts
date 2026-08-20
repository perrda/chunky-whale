/**
 * Fill only the flat white sticker behind a ₿, not the whole chest.
 */
import sharp from "sharp";
import { rgbToHsl } from "../lib/recolor-garment";

function orange(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 16 && deg <= 48 && s > 0.45 && l > 0.26 && l < 0.74;
}

async function heal(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let minx = w;
  let maxx = 0;
  let miny = h;
  let maxy = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (!orange(data[o], data[o + 1], data[o + 2])) continue;
    const x = i % w;
    const y = (i - x) / w;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  if (maxx <= minx) {
    console.log("no orange mark", file);
    return;
  }
  const pad = Math.max(8, Math.round((maxx - minx) * 0.12));
  const x0 = Math.max(0, minx - pad);
  const x1 = Math.min(w - 1, maxx + pad);
  const y0 = Math.max(0, miny - pad);
  const y1 = Math.min(h - 1, maxy + pad);

  const fabric: number[] = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const o = (y * w + x) * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      if (orange(r, g, b)) continue;
      if (r > 250 && g > 250 && b > 250) continue;
      const [, s, l] = rgbToHsl(r, g, b);
      if (l < 0.7 || l > 0.96 || s > 0.14) continue;
      fabric.push(r, g, b);
    }
  }
  if (fabric.length < 20) {
    console.log("no fabric sample", file);
    return;
  }
  let sr = 0;
  let sg = 0;
  let sb = 0;
  const n = fabric.length / 3;
  for (let i = 0; i < fabric.length; i += 3) {
    sr += fabric[i];
    sg += fabric[i + 1];
    sb += fabric[i + 2];
  }
  sr = Math.round(sr / n);
  sg = Math.round(sg / n);
  sb = Math.round(sb / n);

  const out = Buffer.from(data);
  let painted = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const o = (y * w + x) * 4;
      const r = out[o];
      const g = out[o + 1];
      const b = out[o + 2];
      if (orange(r, g, b)) continue;
      if (r < 252 || g < 252 || b < 252) continue;
      out[o] = sr;
      out[o + 1] = sg;
      out[o + 2] = sb;
      painted += 1;
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log({ file, box: { x0, y0, x1, y1 }, painted, fabric: [sr, sg, sb] });
}

heal(process.argv[2] ?? "public/products/satoshi-tee.png");
