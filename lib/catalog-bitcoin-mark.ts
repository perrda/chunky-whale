/** Server / QA only. Do not import from client components — uses fs/sharp. */
import { readFileSync, existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const BITCOIN_B = path.join(process.cwd(), "public/brand/bitcoin-b.svg");
const BITCOIN_COIN = path.join(process.cwd(), "public/brand/bitcoin-coin.svg");

/** Official ₿ spine is ~11–16° off vertical, leaning right (clockwise). */
export const MIN_OFFICIAL_TILT_DEG = 2.2;

/**
 * top-mean-X minus bottom-mean-X, divided by blob height.
 * Official bitboy on a garment stamp is ~+0.016 (≈0.9°) at 384px.
 * The old upright 3D B is ~0.000–0.007.
 */
export const MIN_CLOCKWISE_LEAN = 0.012;

export type MarkLean = "clockwise" | "ccw" | "upright" | "none";

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
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

function isOrange(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 12 && deg <= 54 && s > 0.32 && l > 0.2 && l < 0.86;
}

export function officialMarkFilesPresent() {
  return existsSync(BITCOIN_B) && existsSync(BITCOIN_COIN);
}

export function officialMarkLooksLocked() {
  if (!officialMarkFilesPresent()) return false;
  const b = readFileSync(BITCOIN_B, "utf8");
  const coin = readFileSync(BITCOIN_COIN, "utf8");
  return b.includes("M46.11,27.441") && coin.includes("M46.11,27.441") && coin.includes("#F7931A");
}

type Blob = {
  cells: number[];
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
  bw: number;
  bh: number;
  area: number;
  cx: number;
  cy: number;
};

function blobsFromOrange(data: Buffer, w: number, h: number): Blob[] {
  const seen = new Uint8Array(w * h);
  const blobs: Blob[] = [];
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (seen[i] || !isOrange(data[o], data[o + 1], data[o + 2])) continue;
    const q = [i];
    seen[i] = 1;
    const cells = [i];
    let minx = w;
    let maxx = 0;
    let miny = h;
    let maxy = 0;
    while (q.length) {
      const p = q.pop()!;
      const x = p % w;
      const y = (p - x) / w;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (seen[n]) continue;
        const no = n * 4;
        if (!isOrange(data[no], data[no + 1], data[no + 2])) continue;
        seen[n] = 1;
        q.push(n);
        cells.push(n);
      }
    }
    if (cells.length < 40) continue;
    const bw = maxx - minx + 1;
    const bh = maxy - miny + 1;
    blobs.push({
      cells,
      minx,
      maxx,
      miny,
      maxy,
      bw,
      bh,
      area: cells.length,
      cx: (minx + maxx) / 2,
      cy: (miny + maxy) / 2,
    });
  }
  return blobs;
}

function looksLikeB(blob: Blob, w: number, h: number) {
  const aspect = blob.bw / blob.bh;
  if (blob.bh < 16 && blob.bh < h * 0.05) return false;
  if (blob.bw > w * 0.42 || blob.bh > h * 0.4) return false;
  if (aspect < 0.4 || aspect > 1.4) return false;
  const fill = blob.area / (blob.bw * blob.bh);
  // Official ₿ fill is ~0.55–0.65. A solid orange circle (tote coin) is ~0.75+.
  if (fill < 0.16 || fill > 0.70) return false;
  return true;
}

function isTextRow(blob: Blob, others: Blob[]) {
  const peers = others.filter((o) => {
    if (o === blob) return false;
    const dy = Math.abs(o.cy - blob.cy);
    const hs = Math.abs(o.bh - blob.bh) / Math.max(blob.bh, 1);
    return dy < blob.bh * 0.55 && hs < 0.45 && o.bh < blob.bh * 1.35;
  });
  return peers.length >= 2;
}

function blobLean(blob: Blob, w: number): { dx: number; ratio: number; lean: MarkLean } {
  const tCut = blob.miny + blob.bh * 0.22;
  const bCut = blob.maxy - blob.bh * 0.22;
  let tN = 0;
  let tX = 0;
  let bN = 0;
  let bX = 0;
  for (const p of blob.cells) {
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
  if (tN < 8 || bN < 8) return { dx: 0, ratio: 0, lean: "none" };
  const dx = tX / tN - bX / bN;
  const ratio = dx / blob.bh;
  const lean: MarkLean =
    ratio > MIN_CLOCKWISE_LEAN ? "clockwise" : ratio < -MIN_CLOCKWISE_LEAN ? "ccw" : "upright";
  return { dx, ratio, lean };
}

export async function largestOrangeMarkTilt(absPath: string): Promise<{
  found: boolean;
  tilt: number;
  upright: boolean;
  lean: MarkLean;
  clockwise: boolean;
  primary: boolean;
}> {
  const empty = {
    found: false,
    tilt: 0,
    upright: false,
    lean: "none" as MarkLean,
    clockwise: false,
    primary: false,
  };
  const { data, info } = await sharp(absPath)
    .resize(512, 512, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let garment = 0;
  let orange = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (data[o + 3] < 80) continue;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const [, s, l] = rgbToHsl(r, g, b);
    if (l < 0.93 || s > 0.12) garment += 1;
    if (isOrange(r, g, b)) orange += 1;
  }
  // Orange cloth (Bitcoin-orange garment) — do not treat the shirt as a ₿.
  if (garment > 0 && orange / garment > 0.22) return empty;

  const blobs = blobsFromOrange(data as Buffer, w, h);
  const candidates = blobs
    .filter((b) => looksLikeB(b, w, h) && !isTextRow(b, blobs))
    .sort((a, b) => b.area - a.area);
  const best = candidates[0];
  if (!best) return empty;

  const { ratio, lean } = blobLean(best, w);
  if (lean === "none") return empty;

  const tilt = Math.abs(Math.atan(ratio) * (180 / Math.PI));
  const clockwise = lean === "clockwise";
  const upright = lean === "upright" || lean === "ccw";
  // Chest-filling ₿ (hoodie / hat / mark tee). A 20px badge next to a slogan is not this check.
  const primary = best.bh >= h * 0.16 || best.area >= w * h * 0.022;
  return { found: true, tilt, upright, lean, clockwise, primary };
}
