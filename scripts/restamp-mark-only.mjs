/**
 * Erase one old upright / 3D ₿ and stamp the official bitboy mark.
 * Fabric-clone the bbox so we do not leave a sticker rectangle.
 * One blob only — do not run this on slogan type or orange-coin totes.
 */
import path from "path";
import sharp from "sharp";
import { garmentMarkPng } from "./lib/official-bitcoin-mark.mjs";

const ROOT = process.cwd();

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function isOrange(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 8 && deg <= 58 && s > 0.22 && l > 0.16 && l < 0.88;
}

function nearWhite(r, g, b) {
  const [, s, l] = rgbToHsl(r, g, b);
  return (r > 232 && g > 232 && b > 232) || (l > 0.91 && s < 0.12);
}

function blobsFromMask(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const blobs = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    const q = [i];
    seen[i] = 1;
    const pixels = [];
    let minx = w;
    let maxx = 0;
    let miny = h;
    let maxy = 0;
    while (q.length) {
      const p = q.pop();
      const x = p % w;
      const y = (p - x) / w;
      pixels.push(p);
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      for (const n of [p + 1, p - 1, p + w, p - w]) {
        if (n < 0 || n >= w * h) continue;
        if (!mask[n] || seen[n]) continue;
        const nx = n % w;
        if (Math.abs(nx - x) + Math.abs((n - nx) / w - y) !== 1) continue;
        seen[n] = 1;
        q.push(n);
      }
    }
    const bw = maxx - minx + 1;
    const bh = maxy - miny + 1;
    blobs.push({
      pixels,
      minx,
      maxx,
      miny,
      maxy,
      bw,
      bh,
      area: pixels.length,
      cx: (minx + maxx) / 2,
      cy: (miny + maxy) / 2,
    });
  }
  return blobs;
}

function looksLikeB(blob, w, h) {
  const aspect = blob.bw / blob.bh;
  if (blob.bh < 28) return false;
  if (blob.bw > w * 0.42 || blob.bh > h * 0.4) return false;
  if (aspect < 0.4 || aspect > 1.45) return false;
  const fill = blob.area / (blob.bw * blob.bh);
  if (fill < 0.16 || fill > 0.7) return false;
  return true;
}

async function restamp(file, markPng) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const buf = Buffer.from(data);
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (isOrange(buf[o], buf[o + 1], buf[o + 2])) mask[i] = 1;
  }
  const blobs = blobsFromMask(mask, w, h)
    .filter((b) => looksLikeB(b, w, h))
    .sort((a, b) => b.area - a.area);
  const blob = blobs[0];
  if (!blob) return { file, ok: false, reason: "no-mark" };

  const cx = blob.cx;
  const cy = blob.cy;
  const rx = (blob.bw / 2) * 1.22;
  const ry = (blob.bh / 2) * 1.22;
  const x0 = Math.max(0, Math.floor(cx - rx * 1.2));
  const x1 = Math.min(w - 1, Math.ceil(cx + rx * 1.2));
  const y0 = Math.max(0, Math.floor(cy - ry * 1.2));
  const y1 = Math.min(h - 1, Math.ceil(cy + ry * 1.2));

  const pool = [];
  const ring = Math.max(12, Math.round(Math.min(blob.bw, blob.bh) * 0.28));
  for (let y = Math.max(0, y0 - ring); y <= Math.min(h - 1, y1 + ring); y++) {
    for (let x = Math.max(0, x0 - ring); x <= Math.min(w - 1, x1 + ring); x++) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny < 1.25) continue;
      const o = (y * w + x) * 4;
      if (nearWhite(buf[o], buf[o + 1], buf[o + 2])) continue;
      if (isOrange(buf[o], buf[o + 1], buf[o + 2])) continue;
      pool.push(buf[o], buf[o + 1], buf[o + 2]);
    }
  }
  if (pool.length < 30) return { file, ok: false, reason: "no-fabric" };
  const n = pool.length / 3;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const o = (y * w + x) * 4;
      if (nearWhite(buf[o], buf[o + 1], buf[o + 2])) continue;
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = Math.sqrt(nx * nx + ny * ny);
      if (d > 1.18) continue;
      const t = d < 0.7 ? 1 : Math.max(0, (1.18 - d) / 0.48);
      const pick = Math.floor((Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 43758.5453) % n);
      const po = pick * 3;
      buf[o] = Math.round(buf[o] * (1 - t) + pool[po] * t);
      buf[o + 1] = Math.round(buf[o + 1] * (1 - t) + pool[po + 1] * t);
      buf[o + 2] = Math.round(buf[o + 2] * (1 - t) + pool[po + 2] * t);
    }
  }

  const size = Math.round(Math.max(blob.bw, blob.bh) * 1.08);
  const stamp = await sharp(markPng)
    .resize({ width: size, height: size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const meta = await sharp(stamp).metadata();
  const mw = meta.width ?? size;
  const mh = meta.height ?? size;
  const base = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  await sharp(base)
    .composite([
      {
        input: stamp,
        left: Math.max(0, Math.round(blob.cx - mw / 2)),
        top: Math.max(0, Math.round(blob.cy - mh / 2)),
      },
    ])
    .png()
    .toFile(file);
  return { file, ok: true, size };
}

const files = process.argv.slice(2).map((name) => {
  if (name.startsWith("public/")) return path.join(ROOT, name);
  if (name.startsWith("/")) return path.join(ROOT, "public", name.replace(/^\//, ""));
  return path.join(ROOT, "public/products", name);
});

const markPng = await garmentMarkPng(640);
for (const file of files) {
  const result = await restamp(file, markPng);
  console.log(result.ok ? "restamped" : "skip", path.relative(ROOT, file), result.size ?? result.reason);
}
