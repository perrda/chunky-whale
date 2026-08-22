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
  condensed: [
    path.join(HERE, "../fonts/Oswald-Bold.ttf"),
    path.join(ROOT, "scripts/fonts/Oswald-Bold.ttf"),
  ],
  serif: [
    path.join(HERE, "../fonts/LibreBaskerville-Bold.ttf"),
    path.join(ROOT, "scripts/fonts/LibreBaskerville-Bold.ttf"),
  ],
  display: [
    path.join(HERE, "../fonts/ArchivoBlack-Regular.ttf"),
    path.join(ROOT, "scripts/fonts/ArchivoBlack-Regular.ttf"),
  ],
};

export function resolveFace(face = "inter") {
  const list = FONT_CANDIDATES[face] ?? FONT_CANDIDATES.inter;
  for (const file of list) {
    if (existsSync(file)) return file;
  }
  throw new Error(`${face} font missing. Keep Inter, JetBrains Mono, Oswald, Libre Baskerville, and Archivo Black in scripts/fonts/.`);
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

function lineSize(lines, canvas, layout = "stack") {
  const longest = lines.reduce((n, s) => Math.max(n, s.length), 1);
  const base = longest > 18 ? 54 : longest > 14 ? 62 : longest > 10 ? 74 : longest > 6 ? 86 : 96;
  const bump = layout === "huge" ? 1.36 : layout === "banner" ? 1.08 : 1;
  return Math.round(base * (canvas / SIZE) * bump);
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
export function sloganSvg(lines, { fill = PRINT_WHITE, canvas = SIZE, startY = 690, face = "inter", layout = "stack" } = {}) {
  const font = loadFace(face);
  let size = lineSize(lines, canvas, layout);
  let tracking = Math.round(size * (face === "condensed" || face === "display" ? 0.04 : 0.06));
  const maxW = canvas * 0.84;
  while (size > 28) {
    tracking = Math.round(size * (face === "condensed" || face === "display" ? 0.04 : 0.06));
    const widest = lines.reduce((n, t) => Math.max(n, lineWidth(font, t, size, tracking)), 0);
    if (widest <= maxW) break;
    size -= 3;
  }
  const lineH = Math.round(size * (face === "serif" ? 1.32 : 1.22));
  const paths = [];
  let lastY = startY;
  let lastW = 0;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const width = lineWidth(font, text, size, tracking);
    let x = (canvas - width) / 2;
    const y = startY + i * lineH;
    lastY = y;
    lastW = width;
    const glyphs = glyphsFor(font, text);
    for (let g = 0; g < glyphs.length; g++) {
      const glyph = glyphs[g];
      const p = glyph.getPath(x, y, size);
      const d = p.toPathData({ decimalPlaces: 2, flipY: false });
      if (d) paths.push(`<path d="${d}" fill="${fill}"/>`);
      x += glyph.advanceWidth * (size / font.unitsPerEm) + tracking;
    }
  }
  if (layout === "banner" && lastW) {
    const barW = Math.min(canvas * 0.42, lastW * 0.72);
    const barX = (canvas - barW) / 2;
    const barY = lastY + Math.round(size * 0.28);
    paths.push(`<rect x="${barX.toFixed(1)}" y="${barY}" width="${barW.toFixed(1)}" height="${Math.max(5, size * 0.07)}" fill="${fill}"/>`);
  }
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvas}" height="${canvas}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
  ${paths.join("")}
</svg>`);
}

/** Vector type at 2×, then Lanczos — smooth edges, solid letters. Never distressed. */
export async function sloganPng(lines, { fill = PRINT_WHITE, canvas = SIZE, startY = 690, face = "inter", layout = "stack" } = {}) {
  const hi = canvas * 2;
  const svg = sloganSvg(lines, { fill, canvas: hi, startY: startY * 2, face, layout });
  return sharp(svg)
    .resize(canvas, canvas, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
}

export async function markStamp(width = 200, { stitch = false } = {}) {
  const hi = await garmentMarkPng(width * 2);
  const mark = await sharp(hi)
    .resize({
      width,
      height: width,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();
  if (!stitch) return mark;
  const under = await sharp(mark)
    .modulate({ brightness: 0.62, saturation: 1.05 })
    .png()
    .toBuffer();
  const pad = 4;
  return sharp({
    create: { width: width + pad, height: width + pad, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: under, left: pad, top: pad },
      { input: mark, left: 0, top: 0 },
    ])
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
  layout = "stack",
  stitch = false,
}) {
  let raw = await loadRaw(template, SIZE);
  raw = await blankChest(raw, kind);
  raw = recolorGarment(raw, hex);
  const base = await toPng(raw);
  const mid = Math.round(SIZE / 2);
  const crest = layout === "crest";
  const huge = layout === "huge";
  let markW = markOnly ? (markSmall ? 170 : 420) : huge ? 230 : 300;
  if (crest) markW = markOnly ? 132 : 168;
  const markTop = crest
    ? kind === "hoodie"
      ? 390
      : 360
    : markOnly
      ? kind === "hoodie"
        ? 400
        : markSmall
          ? 450
          : 375
      : kind === "hoodie"
        ? 375
        : 354;
  const markLeft = crest ? Math.round(SIZE * 0.36 - markW / 2) : Math.round(mid - markW / 2);
  const stamp = await markStamp(markW, { stitch });
  const layers = [
    {
      input: stamp,
      left: markLeft,
      top: markTop,
    },
  ];
  if (!markOnly && lines.length) {
    const startY = markTop + markW + (huge ? 18 : 28);
    layers.push({
      input: await sloganPng(lines, { fill, face, layout, canvas: SIZE, startY }),
      left: 0,
      top: 0,
    });
  }
  await sharp(base).composite(layers).png({ compressionLevel: 9 }).toFile(outFile);
  return outFile;
}

/** Quiet formal polo — collar + placket + stitched ₿ only. No slogans. */
export async function renderPolo({ outFile, hex = INK, place = "crest" }) {
  const w = SIZE;
  const h = SIZE;
  const [r, g, b] = hexToRgb(hex);
  const [hh, ss, ll] = rgbToHsl(r, g, b);
  const [cr, cg, cb] = hslToRgb(hh, ss, Math.min(0.42, ll + 0.07));
  const [pr, pg, pb] = hslToRgb(hh, ss, Math.max(0.04, ll - 0.04));
  const [br, bg, bb] = hslToRgb(hh, Math.max(0, ss - 0.1), Math.min(0.72, ll + 0.28));
  const cloth = `rgb(${r},${g},${b})`;
  const collar = `rgb(${cr},${cg},${cb})`;
  const placket = `rgb(${pr},${pg},${pb})`;
  const button = `rgb(${br},${bg},${bb})`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <g fill="${cloth}">
    <path d="M430 410 C470 250 620 210 768 210 C916 210 1066 250 1106 410
             L1280 520 L1240 700 L1088 620 L1108 1320 L428 1320 L448 620 L296 700 L256 520 Z"/>
  </g>
  <path d="M620 250 C700 300 768 318 836 300 C836 300 900 250 916 230
           C860 210 768 208 620 250 Z" fill="${collar}"/>
  <path d="M620 250 C640 320 700 360 768 368 C700 300 640 270 620 250 Z" fill="${collar}"/>
  <path d="M916 230 C896 320 836 360 768 368 C836 300 896 270 916 230 Z" fill="${collar}"/>
  <rect x="748" y="368" width="40" height="196" fill="${placket}"/>
  <circle cx="768" cy="410" r="7" fill="${button}"/>
  <circle cx="768" cy="458" r="7" fill="${button}"/>
  <circle cx="768" cy="506" r="7" fill="${button}"/>
</svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const markW = place === "center" ? 148 : place === "mini" ? 78 : 96;
  const stamp = await markStamp(markW, { stitch: true });
  const left = place === "center" ? Math.round(w / 2 - (markW + 4) / 2) : Math.round(w * 0.39 - markW / 2);
  const top = place === "center" ? 520 : 430;
  await sharp(base)
    .composite([{ input: stamp, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outFile);
  return outFile;
}
