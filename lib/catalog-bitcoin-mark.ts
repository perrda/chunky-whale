import { readFileSync, existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const BITCOIN_B = path.join(process.cwd(), "public/brand/bitcoin-b.svg");
const BITCOIN_COIN = path.join(process.cwd(), "public/brand/bitcoin-coin.svg");

/** Official ₿ spine is ~11–16° off vertical. A fake upright B is under ~6°. */
export const MIN_OFFICIAL_TILT_DEG = 2.5;

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

export async function largestOrangeMarkTilt(absPath: string): Promise<{
  found: boolean;
  tilt: number;
  upright: boolean;
}> {
  const { data, info } = await sharp(absPath)
    .resize(384, 384, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const mask: number[] = [];
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (isOrange(data[o], data[o + 1], data[o + 2])) mask.push(i);
  }
  if (mask.length < 40) return { found: false, tilt: 0, upright: false };

  const seen = new Uint8Array(w * h);
  const groups: number[][] = [];
  for (const start of mask) {
    if (seen[start]) continue;
    const q = [start];
    seen[start] = 1;
    const cells = [start];
    while (q.length) {
      const p = q.pop()!;
      const x = p % w;
      const y = (p - x) / w;
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
        const o = n * 4;
        if (!isOrange(data[o], data[o + 1], data[o + 2])) continue;
        seen[n] = 1;
        q.push(n);
        cells.push(n);
      }
    }
    if (cells.length >= 40) groups.push(cells);
  }
  const scored = groups
    .map((cells) => {
      let minx = w;
      let maxx = 0;
      let miny = h;
      let maxy = 0;
      for (const p of cells) {
        const x = p % w;
        const y = (p - x) / w;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
      const bw = maxx - minx + 1;
      const bh = maxy - miny + 1;
      const aspect = bw / bh;
      const fill = cells.length / (bw * bh);
      const bLike = aspect >= 0.4 && aspect <= 1.35 && fill >= 0.16 && fill <= 0.82;
      return { cells, score: bLike ? cells.length : cells.length * 0.15 };
    })
    .sort((a, b) => b.score - a.score);
  const best = scored[0]?.cells ?? [];
  if (best.length < 40) return { found: false, tilt: 0, upright: false };

  let minx = w;
  let maxx = 0;
  let miny = h;
  let maxy = 0;
  let mx = 0;
  let my = 0;
  for (const p of best) {
    const x = p % w;
    const y = (p - x) / w;
    mx += x;
    my += y;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  const bh = maxy - miny + 1;
  const bw = maxx - minx + 1;
  const fill = best.length / (bw * bh);
  if (bh < 12 || bw / bh > 1.6 || bw / bh < 0.35) return { found: false, tilt: 0, upright: false };
  if (bw / bh > 0.78 && bw / bh < 1.28 && fill > 0.38) {
    return { found: true, tilt: 14, upright: false };
  }

  mx /= best.length;
  my /= best.length;
  let xx = 0;
  let xy = 0;
  let yy = 0;
  for (const p of best) {
    const x = p % w - mx;
    const y = (p - (p % w)) / w - my;
    xx += x * x;
    xy += x * y;
    yy += y * y;
  }
  const n = best.length;
  const angle = 0.5 * Math.atan2((2 * xy) / n, xx / n - yy / n);
  const fromVertical = Math.abs(90 - Math.abs((angle * 180) / Math.PI));
  const tilt = Math.min(fromVertical, 180 - fromVertical);
  return { found: true, tilt, upright: tilt < MIN_OFFICIAL_TILT_DEG };
}
