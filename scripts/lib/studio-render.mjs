/**
 * High-quality catalog stamps. Clean chest, official ₿, solid Inter.
 * Never clone random fabric pixels (that is the distressed-letter bug).
 * Never lock a printed HODL tee as the ghost template.
 */
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";
import sharp from "sharp";
import { garmentMarkPng } from "./official-bitcoin-mark.mjs";

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(ROOT, "public/products");
export const TMPL_DIR = path.join(ROOT, "public/templates");
export const PRINT_WHITE = "#FFFFFF";
export const PRINT_INK = "#161616";
export const INK = "#0B0C0E";
export const SIZE = 1536;

const FONT_CANDIDATES = {
  inter: [
    path.join(HERE, "../fonts/Inter-Bold.ttf"),
    path.join(ROOT, "scripts/fonts/Inter-Bold.ttf"),
    "/usr/share/fonts/truetype/macos/Inter-Bold.ttf",
  ],
  mono: [
    path.join(HERE, "../fonts/JetBrainsMono-Bold.ttf"),
    path.join(ROOT, "scripts/fonts/JetBrainsMono-Bold.ttf"),
    "/usr/share/fonts/truetype/macos/JetBrainsMono-Bold.ttf",
  ],
};

export function resolveFace(face = "inter") {
  const list = FONT_CANDIDATES[face] ?? FONT_CANDIDATES.inter;
  for (const file of list) {
    if (existsSync(file)) return file;
  }
  throw new Error(`${face} font missing. Keep scripts/fonts/Inter-Bold.ttf (and JetBrainsMono-Bold.ttf) in the repo.`);
}

export function resolveInterBold() {
  return resolveFace("inter");
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHsl(r, g, b) {
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

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * ((2 / 3 - t) * 6);
  return p;
}

export function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

export function nearWhite(r, g, b) {
  const [, s, l] = rgbToHsl(r, g, b);
  return (r > 232 && g > 232 && b > 232) || (l > 0.91 && s < 0.12);
}

export function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&apos;");
}

export async function loadRaw(file, size = SIZE) {
  const { data, info } = await sharp(file)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

export function backgroundMask(data, w, h) {
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

function fabricMedian(data, w, h, bg) {
  const bands = [
    [0.16, 0.28, 0.20, 0.32],
    [0.72, 0.84, 0.20, 0.32],
    [0.12, 0.22, 0.42, 0.58],
    [0.78, 0.88, 0.42, 0.58],
  ];
  const rs = [];
  const gs = [];
  const bs = [];
  for (const [x0, x1, y0, y1] of bands) {
    const xa = Math.floor(w * x0);
    const xb = Math.floor(w * x1);
    const ya = Math.floor(h * y0);
    const yb = Math.floor(h * y1);
    for (let y = ya; y < yb; y += 2) {
      for (let x = xa; x < xb; x += 2) {
        const i = y * w + x;
        if (bg[i]) continue;
        const o = i * 4;
        const [, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
        if (s > 0.4 && l > 0.22 && l < 0.78) continue;
        if (l > 0.86 || l < 0.04) continue;
        rs.push(data[o]);
        gs.push(data[o + 1]);
        bs.push(data[o + 2]);
      }
    }
  }
  const mid = (arr) => {
    if (!arr.length) return 28;
    arr.sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  return [mid(rs), mid(gs), mid(bs)];
}

function chestEllipse(kind, w, h) {
  if (kind === "hoodie") return { cx: w * 0.5, cy: h * 0.4, rx: w * 0.3, ry: h * 0.24 };
  if (kind === "ls") return { cx: w * 0.5, cy: h * 0.38, rx: w * 0.3, ry: h * 0.24 };
  return { cx: w * 0.5, cy: h * 0.38, rx: w * 0.32, ry: h * 0.26 };
}

function orangeMark(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 14 && deg <= 52 && s > 0.32 && l > 0.2 && l < 0.82;
}

/**
 * Keep the ghost silhouette, paint smooth studio cloth.
 * No leftover slogan can survive — the chest is new cloth.
 */
export async function blankChest(raw) {
  const { data, width: w, height: h } = raw;
  const bg = backgroundMask(data, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (bg[i]) continue;
      const o = i * 4;
      const dx = (x - w * 0.5) / (w * 0.28);
      const dy = (y - h * 0.36) / (h * 0.4);
      const radial = Math.min(1.2, dx * dx + dy * dy * 0.75);
      const hem = Math.max(0, (y - h * 0.78) / (h * 0.22)) * 0.03;
      const fold = Math.min(0.16, Math.max(0.045, 0.09 + 0.05 * (1 - radial) - hem));
      const [nr, ng, nb] = hslToRgb(0.67, 0.04, fold);
      data[o] = nr;
      data[o + 1] = ng;
      data[o + 2] = nb;
      data[o + 3] = 255;
    }
  }
  return raw;
}

export function recolorGarment(raw, targetHex) {
  const { data, width: w, height: h } = raw;
  const [th, ts, tl] = rgbToHsl(...hexToRgb(targetHex));
  const bg = backgroundMask(data, w, h);
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    const [, , l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
    const outL = Math.min(0.82, Math.max(0.05, l * 0.55 + tl * 0.45));
    const [nr, ng, nb] = hslToRgb(th, Math.min(0.72, ts * 0.94), outL);
    data[o] = nr;
    data[o + 1] = ng;
    data[o + 2] = nb;
  }
  return raw;
}

export async function toPng(raw) {
  return sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
    .png()
    .toBuffer();
}

function lineSize(lines, canvas) {
  const longest = lines.reduce((n, s) => Math.max(n, s.length), 1);
  const base = longest > 18 ? 54 : longest > 14 ? 62 : longest > 10 ? 74 : longest > 6 ? 86 : 96;
  return Math.round(base * (canvas / SIZE));
}

const fontCache = new Map();
function loadFace(face = "inter") {
  if (!fontCache.has(face)) {
    const buf = readFileSync(resolveFace(face));
    fontCache.set(face, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  return fontCache.get(face);
}

function glyphsFor(font, text) {
  return [...text].map((ch) => font.charToGlyph(ch));
}

function lineWidth(font, text, size, tracking) {
  let x = 0;
  const glyphs = glyphsFor(font, text);
  for (let i = 0; i < glyphs.length; i++) {
    x += (glyphs[i].advanceWidth || 0) * (size / font.unitsPerEm);
    if (i < glyphs.length - 1) x += tracking;
  }
  return x;
}

/** Inter as SVG paths — never a font-face raster that goes soft or distressed. */
export function sloganSvg(lines, { fill = PRINT_WHITE, canvas = SIZE, startY = 690, face = "inter" } = {}) {
  const font = loadFace(face);
  const size = lineSize(lines, canvas);
  const tracking = Math.round(size * 0.06);
  const lineH = Math.round(size * 1.22);
  const paths = [];
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const width = lineWidth(font, text, size, tracking);
    let x = (canvas - width) / 2;
    const y = startY + i * lineH;
    const glyphs = glyphsFor(font, text);
    for (let g = 0; g < glyphs.length; g++) {
      const glyph = glyphs[g];
      const p = glyph.getPath(x, y, size);
      const d = p.toPathData({ decimalPlaces: 2, flipY: false });
      if (d) paths.push(`<path d="${d}" fill="${fill}"/>`);
      x += glyph.advanceWidth * (size / font.unitsPerEm) + tracking;
    }
  }
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvas}" height="${canvas}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
  ${paths.join("")}
</svg>`);
}

/** Vector Inter at 2×, then Lanczos — smooth edges, solid letters. */
export async function sloganPng(lines, { fill = PRINT_WHITE, canvas = SIZE, startY = 690, face = "inter" } = {}) {
  const hi = canvas * 2;
  const svg = sloganSvg(lines, { fill, canvas: hi, startY: startY * 2, face });
  return sharp(svg)
    .resize(canvas, canvas, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
}

export async function markStamp(width = 200) {
  const hi = await garmentMarkPng(width * 2);
  return sharp(hi)
    .resize({
      width,
      height: width,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();
}

export async function renderApparel({
  template,
  outFile,
  lines = [],
  hex = INK,
  kind = "tee",
  markOnly = false,
  markSmall = false,
  fill = PRINT_WHITE,
  face = "inter",
}) {
  let raw = await loadRaw(template, SIZE);
  raw = await blankChest(raw, kind);
  raw = recolorGarment(raw, hex);
  const base = await toPng(raw);
  const mid = Math.round(SIZE / 2);
  const markW = markOnly ? (markSmall ? 170 : 420) : 300;
  const markTop = markOnly ? (kind === "hoodie" ? 400 : markSmall ? 450 : 375) : kind === "hoodie" ? 375 : 354;
  const layers = [
    {
      input: await markStamp(markW),
      left: Math.round(mid - markW / 2),
      top: markTop,
    },
  ];
  if (!markOnly && lines.length) {
    const startY = markTop + markW + 28;
    layers.push({
      input: await sloganPng(lines, { fill, face, canvas: SIZE, startY }),
      left: 0,
      top: 0,
    });
  }
  await sharp(base).composite(layers).png({ compressionLevel: 9 }).toFile(outFile);
  return outFile;
}
