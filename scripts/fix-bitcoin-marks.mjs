/**
 * Replace fake upright “B with bars” marks with the official bitboy ₿
 * (~14° clockwise, #F7931A) on every catalog photo and print.
 *
 * Skips orange slogan letters (a horizontal row of similar blobs).
 * Skips blank glass templates. Does not invent a new B.
 */
import { readdirSync, writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";
import { officialMarkPng } from "./lib/official-bitcoin-mark.mjs";
import { WHISKEYS, SHOTS } from "./render-glass-mockups.mjs";

const ROOT = process.cwd();
const SKIP = new Set([
  "whiskey-blank.png",
  "shot-blank.png",
  "so-back-hoodie.png",
  "so-over-hoodie.png",
  "no-forecast-hoodie.png",
  "stay-humble-hoodie.png",
  "proof-of-work-hoodie.png",
  "not-your-keys-hoodie.png",
  "hard-money-hoodie.png",
  "verify-hoodie.png",
  "few-understand-hoodie.png",
  "no-laser-pullover.png",
  "orange-pill-pullover.png",
  "hodl-pullover.png",
  "stack-sats-pullover.png",
  "timechain-pullover.png",
  "digital-energy-pullover.png",
  "four-year-pullover.png",
  "b-mark-pullover.png",
  "stay-humble-pullover.png",
  "proof-of-work-pullover.png",
  "not-your-keys-pullover.png",
  "hard-money-pullover.png",
  "sound-money-pullover.png",
  "cold-storage-pullover.png",
  "self-custody-pullover.png",
  "verify-pullover.png",
  "few-understand-pullover.png",
  "bitcoin-mummy-pullover.png",
  "bitcoin-daddy-pullover.png",
  "bitcoin-daddy-hoodie.png",
  "hodl-hoodie.png",
  "hodl-hoodie-navy.png",
  "b-mark-hoodie.png",
  "embroidered-b-hoodie-navy.png",
  ...WHISKEYS.map((s) => s.file),
  ...SHOTS.map((s) => s.file),
]);

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
      const nbs = [p + 1, p - 1, p + w, p - w];
      for (const n of nbs) {
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
    blobs.push({ pixels, minx, maxx, miny, maxy, bw, bh, area: pixels.length, cx: (minx + maxx) / 2, cy: (miny + maxy) / 2 });
  }
  return blobs;
}

function looksLikeB(blob) {
  const aspect = blob.bw / blob.bh;
  if (blob.bh < 26 || blob.bh > 560) return false;
  if (aspect < 0.4 || aspect > 1.4) return false;
  const fill = blob.area / (blob.bw * blob.bh);
  if (fill < 0.16 || fill > 0.70) return false;
  return true;
}

/** Official bitboy: top of the mark sits right of the bottom (clockwise / lean right). */
function blobLean(blob, w) {
  const tCut = blob.miny + blob.bh * 0.22;
  const bCut = blob.maxy - blob.bh * 0.22;
  let tN = 0;
  let tX = 0;
  let bN = 0;
  let bX = 0;
  for (const p of blob.pixels) {
    const x = p % w;
    const y = (p - x) / w;
    if (y <= tCut) {
      tN += 1;
      tX += x;
    }
    if (y >= bCut) {
      bN += 1;
      bX += x;
    }
  }
  if (tN < 8 || bN < 8) return "unknown";
  const ratio = (tX / tN - bX / bN) / blob.bh;
  if (ratio > 0.012) return "clockwise";
  if (ratio < -0.012) return "ccw";
  return "upright";
}

function looksLikeCoin(blob) {
  const aspect = blob.bw / blob.bh;
  const fill = blob.area / (blob.bw * blob.bh);
  return blob.bh >= 40 && aspect > 0.78 && aspect < 1.28 && fill > 0.14 && fill < 0.62;
}

function isTextRow(blob, others) {
  const peers = others.filter((o) => {
    if (o === blob) return false;
    const dy = Math.abs(o.cy - blob.cy);
    const hs = Math.abs(o.bh - blob.bh) / Math.max(blob.bh, 1);
    return dy < blob.bh * 0.55 && hs < 0.45 && o.bh < blob.bh * 1.35;
  });
  return peers.length >= 2;
}

function samplePaint(data, w, h, blob, bg) {
  const counts = new Map();
  const ring = Math.max(4, Math.round(Math.min(blob.bw, blob.bh) * 0.12));
  for (let y = Math.max(0, blob.miny - ring); y <= Math.min(h - 1, blob.maxy + ring); y++) {
    for (let x = Math.max(0, blob.minx - ring); x <= Math.min(w - 1, blob.maxx + ring); x++) {
      if (x >= blob.minx && x <= blob.maxx && y >= blob.miny && y <= blob.maxy) continue;
      const i = y * w + x;
      if (bg[i]) continue;
      const o = i * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      if (isOrange(r, g, b) || nearWhite(r, g, b)) continue;
      const key = `${r >> 3},${g >> 3},${b >> 3}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  let best = null;
  let n = 0;
  for (const [key, c] of counts) {
    if (c > n) {
      n = c;
      best = key;
    }
  }
  if (!best) return [20, 20, 22];
  const [r, g, b] = best.split(",").map((v) => Number(v) * 8 + 4);
  return [r, g, b];
}

function floodBackground(data, w, h) {
  const bg = new Uint8Array(w * h);
  const q = [];
  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (bg[i]) return;
    const o = i * 4;
    if (!nearWhite(data[o], data[o + 1], data[o + 2])) return;
    bg[i] = 1;
    q.push(i);
  };
  for (let x = 0; x < w; x++) {
    tryPush(x, 0);
    tryPush(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryPush(0, y);
    tryPush(w - 1, y);
  }
  while (q.length) {
    const i = q.pop();
    const x = i % w;
    const y = (i - x) / w;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }
  return bg;
}

function paintBlob(data, w, h, blob, rgb, extra = 8) {
  const [pr, pg, pb] = rgb;
  const pad = Math.max(extra, Math.round(Math.min(blob.bw, blob.bh) * 0.18));
  const x0 = Math.max(0, blob.minx - pad);
  const x1 = Math.min(w - 1, blob.maxx + pad);
  const y0 = Math.max(0, blob.miny - pad);
  const y1 = Math.min(h - 1, blob.maxy + pad);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const o = (y * w + x) * 4;
      if (nearWhite(data[o], data[o + 1], data[o + 2])) continue;
      const [hues, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
      const deg = hues * 360;
      const leftoverOrange = deg >= 8 && deg <= 62 && s > 0.18 && l > 0.12 && l < 0.9;
      const inCore = x >= blob.minx && x <= blob.maxx && y >= blob.miny && y <= blob.maxy;
      if (!inCore && !leftoverOrange) continue;
      data[o] = pr;
      data[o + 1] = pg;
      data[o + 2] = pb;
    }
  }
}

async function loadRaw(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

async function fixFile(file, bMark, coinMark) {
  const name = path.basename(file);
  if (SKIP.has(name)) return { file, replaced: 0, skipped: "blank" };
  if (name.endsWith("-whiskey.png") || name.endsWith("-shot.png")) {
    return { file, replaced: 0, skipped: "rendered" };
  }
  const raw = await loadRaw(file);
  const { data, width: w, height: h } = raw;
  const bg = floodBackground(data, w, h);
  let garment = 0;
  let orange = 0;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    garment += 1;
    if (isOrange(data[o], data[o + 1], data[o + 2])) {
      orange += 1;
      mask[i] = 1;
    }
  }
  const forced = process.argv.slice(2).length > 0;
  if (!forced && garment > 0 && orange / garment > 0.22) {
    return { file, replaced: 0, skipped: "orange-garment" };
  }
  const blobs = blobsFromMask(mask, w, h).filter((b) => b.area >= 80);
  const candidates = blobs
    .filter((b) => (looksLikeB(b) || looksLikeCoin(b)) && !isTextRow(b, blobs))
    .filter((b) => blobLean(b, w) !== "clockwise")
    .sort((a, b) => b.area - a.area)
    .slice(0, name.includes("coaster") ? 6 : 1);
  if (!candidates.length) return { file, replaced: 0, skipped: "no-mark" };

  const layers = [];
  for (const blob of candidates) {
    if (name.startsWith("print-")) {
      paintBlob(data, w, h, blob, [0, 0, 0], 6);
    }
    const coin = looksLikeCoin(blob) && blob.area / (blob.bw * blob.bh) < 0.45;
    const src = coin ? coinMark : bMark;
    const size = Math.round(Math.max(blob.bw, blob.bh) * (coin ? 1.06 : 1.22));
    const mark = await sharp(src)
      .resize({ width: size, height: size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const meta = await sharp(mark).metadata();
    const mw = meta.width ?? size;
    const mh = meta.height ?? size;
    layers.push({
      input: mark,
      left: Math.max(0, Math.round(blob.cx - mw / 2)),
      top: Math.max(0, Math.round(blob.cy - mh / 2)),
    });
  }

  const base = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  await sharp(base).composite(layers).png().toFile(file);
  return { file, replaced: candidates.length };
}

async function main() {
  const only = process.argv.slice(2);
  const dirs = [path.join(ROOT, "public/products"), path.join(ROOT, "public/prints")];
  const files = [];
  for (const dir of dirs) {
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".png")) continue;
      if (only.length && !only.includes(name)) continue;
      files.push(path.join(dir, name));
    }
  }
  const bMark = await officialMarkPng("b", 512);
  const coinMark = await officialMarkPng("coin", 512);
  const summary = { replaced: 0, files: 0, skipped: {} };
  for (const file of files) {
    const result = await fixFile(file, bMark, coinMark);
    if (result.replaced) {
      summary.replaced += result.replaced;
      summary.files += 1;
      console.log("fixed", path.relative(ROOT, file), result.replaced);
    } else {
      const key = result.skipped ?? "none";
      summary.skipped[key] = (summary.skipped[key] ?? 0) + 1;
    }
  }
  console.log(JSON.stringify(summary, null, 2));
  writeFileSync(path.join(ROOT, ".tmp-btc-mark-summary.json"), JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
