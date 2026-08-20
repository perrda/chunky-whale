/**
 * Build unique square hoodie / pullover catalog shots from existing
 * ghost-mannequin templates. Covers the old chest print and stamps a
 * new ₿ + slogan so Pullovers never reuse a hoodie photo.
 */
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { officialMarkPng } from "./lib/official-bitcoin-mark.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/products");
const FONT = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf";
const TMPL_DIR = path.join(ROOT, "public/templates");
const PULLOVER_TMPL = path.join(TMPL_DIR, "pullover-ghost.png");
const HOODIE_TMPL = path.join(TMPL_DIR, "hoodie-ghost.png");

function lockTemplates() {
  mkdirSync(TMPL_DIR, { recursive: true });
  const pullSrc = path.join(OUT, "21m-pullover.png");
  const hoodSrc = path.join(OUT, "hodl-hoodie.png");
  if (!existsSync(PULLOVER_TMPL) && existsSync(pullSrc)) copyFileSync(pullSrc, PULLOVER_TMPL);
  if (!existsSync(HOODIE_TMPL) && existsSync(hoodSrc)) copyFileSync(hoodSrc, HOODIE_TMPL);
}

const HOODIES = [
  { file: "so-back-hoodie.png", lines: ["WE ARE", "SO BACK"], hex: "#0B0C0E" },
  { file: "so-over-hoodie.png", lines: ["IT'S SO", "OVER"], hex: "#1B2430" },
  { file: "no-forecast-hoodie.png", lines: ["NOT A", "FORECAST"], hex: "#3A3D42" },
  { file: "stay-humble-hoodie.png", lines: ["STAY", "HUMBLE"], hex: "#2D5A3D" },
  { file: "proof-of-work-hoodie.png", lines: ["PROOF OF", "WORK"], hex: "#0B0C0E" },
  { file: "not-your-keys-hoodie.png", lines: ["NOT YOUR", "KEYS"], hex: "#1B2430" },
  { file: "hard-money-hoodie.png", lines: ["HARD", "MONEY"], hex: "#6B1D2A" },
  { file: "verify-hoodie.png", lines: ["DON'T TRUST.", "VERIFY."], hex: "#3A3D42" },
  { file: "few-understand-hoodie.png", lines: ["FEW", "UNDERSTAND"], hex: "#0B0C0E" },
  { file: "hodl-hoodie.png", lines: ["HODL"], hex: "#0B0C0E" },
  { file: "hodl-hoodie-navy.png", lines: ["HODL"], hex: "#1B2430" },
  { file: "bitcoin-daddy-hoodie.png", lines: ["BITCOIN", "DADDY"], hex: "#0B0C0E" },
  { file: "b-mark-hoodie.png", lines: [], hex: "#0B0C0E", markOnly: true },
  { file: "embroidered-b-hoodie-navy.png", lines: [], hex: "#1B2430", markOnly: true },
];

const PULLOVERS = [
  { file: "no-laser-pullover.png", lines: ["NO LASER", "EYES"], hex: "#1B2430", tmpl: "pullover" },
  { file: "orange-pill-pullover.png", lines: ["ORANGE", "PILL"], hex: "#0B0C0E", tmpl: "pullover" },
  { file: "hodl-pullover.png", lines: ["I AM", "HODLING"], hex: "#3A3D42", tmpl: "pullover" },
  { file: "stack-sats-pullover.png", lines: ["STACK", "SATS"], hex: "#2D5A3D", tmpl: "pullover" },
  { file: "timechain-pullover.png", lines: ["TIMECHAIN"], hex: "#0B0C0E", tmpl: "pullover" },
  { file: "digital-energy-pullover.png", lines: ["DIGITAL", "ENERGY"], hex: "#1B2430", tmpl: "pullover" },
  { file: "four-year-pullover.png", lines: ["FOUR YEAR", "TIDE"], hex: "#1D4E89", tmpl: "pullover" },
  { file: "b-mark-pullover.png", lines: [], hex: "#0B0C0E", tmpl: "pullover", markOnly: true },
  { file: "stay-humble-pullover.png", lines: ["STAY HUMBLE", "STACK SATS"], hex: "#3A3D42", tmpl: "pullover" },
  { file: "proof-of-work-pullover.png", lines: ["PROOF OF", "WORK"], hex: "#6B1D2A", tmpl: "pullover" },
  { file: "not-your-keys-pullover.png", lines: ["NOT YOUR KEYS", "NOT YOUR COINS"], hex: "#1B2430", tmpl: "pullover" },
  { file: "hard-money-pullover.png", lines: ["HARD", "MONEY"], hex: "#2D5A3D", tmpl: "pullover" },
  { file: "sound-money-pullover.png", lines: ["SOUND", "MONEY"], hex: "#0B0C0E", tmpl: "pullover" },
  { file: "cold-storage-pullover.png", lines: ["COLD", "STORAGE"], hex: "#1B2430", tmpl: "pullover" },
  { file: "self-custody-pullover.png", lines: ["SELF", "CUSTODY"], hex: "#3A3D42", tmpl: "pullover" },
  { file: "verify-pullover.png", lines: ["DON'T TRUST.", "VERIFY."], hex: "#0B0C0E", tmpl: "pullover" },
  { file: "few-understand-pullover.png", lines: ["FEW", "UNDERSTAND"], hex: "#6B7A3D", tmpl: "pullover" },
  { file: "bitcoin-mummy-pullover.png", lines: ["BITCOIN", "MUMMY"], hex: "#1D4E89", tmpl: "pullover" },
  { file: "bitcoin-daddy-pullover.png", lines: ["BITCOIN", "DADDY"], hex: "#0B0C0E", tmpl: "pullover" },
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

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

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * ((2 / 3 - t) * 6);
  return p;
}

function hslToRgb(h, s, l) {
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

function nearWhite(r, g, b) {
  const [, s, l] = rgbToHsl(r, g, b);
  return (r > 232 && g > 232 && b > 232) || (l > 0.91 && s < 0.12);
}

async function loadRaw(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

function sampleShoulder(data, w, h) {
  const spots = [
    [Math.floor(w * 0.28), Math.floor(h * 0.36)],
    [Math.floor(w * 0.72), Math.floor(h * 0.36)],
    [Math.floor(w * 0.22), Math.floor(h * 0.28)],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of spots) {
    const o = (y * w + x) * 4;
    r += data[o];
    g += data[o + 1];
    b += data[o + 2];
  }
  return [Math.round(r / spots.length), Math.round(g / spots.length), Math.round(b / spots.length)];
}

function backgroundMask(data, w, h) {
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

function recolorGarment(raw, targetHex) {
  const { data, width: w, height: h } = raw;
  const [th, ts, tl] = rgbToHsl(...hexToRgb(targetHex));
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
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    const [, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
    if (l > 0.9 && s < 0.12) continue;
    const outL = Math.min(0.88, Math.max(0.07, l * 0.62 + tl * 0.38));
    const [nr, ng, nb] = hslToRgb(th, Math.min(0.7, ts * 0.9 + s * 0.1), outL);
    data[o] = nr;
    data[o + 1] = ng;
    data[o + 2] = nb;
  }
  return raw;
}

function fabricPool(data, w, h, bg) {
  const pool = [];
  const bands = [
    [0.18, 0.28, 0.26, 0.36],
    [0.72, 0.82, 0.26, 0.36],
    [0.14, 0.22, 0.40, 0.52],
    [0.78, 0.86, 0.40, 0.52],
  ];
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
        if (s > 0.45 && l > 0.28 && l < 0.72) continue;
        if (l > 0.88) continue;
        pool.push(data[o], data[o + 1], data[o + 2]);
      }
    }
  }
  return pool;
}

/** Hide the old chest print by cloning real fabric — never a flat rectangle. */
function coverPrint(raw, kind) {
  const { data, width: w, height: h } = raw;
  const bg = backgroundMask(data, w, h);
  const pool = fabricPool(data, w, h, bg);
  if (pool.length < 30) return raw;
  const cx = w * 0.5;
  const cy = kind === "hoodie" ? h * 0.38 : h * 0.4;
  const rx = kind === "hoodie" ? w * 0.28 : w * 0.3;
  const ry = kind === "hoodie" ? h * 0.2 : h * 0.22;
  const n = pool.length / 3;
  for (let y = Math.floor(cy - ry * 1.25); y < cy + ry * 1.25; y++) {
    for (let x = Math.floor(cx - rx * 1.25); x < cx + rx * 1.25; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = y * w + x;
      if (bg[i]) continue;
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = Math.sqrt(nx * nx + ny * ny);
      if (d > 1.2) continue;
      const t = d < 0.72 ? 1 : Math.max(0, (1.2 - d) / 0.48);
      const pick = Math.floor((Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 43758.5453) % n);
      const po = pick * 3;
      const o = i * 4;
      data[o] = Math.round(data[o] * (1 - t) + pool[po] * t);
      data[o + 1] = Math.round(data[o + 1] * (1 - t) + pool[po + 1] * t);
      data[o + 2] = Math.round(data[o + 2] * (1 - t) + pool[po + 2] * t);
    }
  }
  return raw;
}

/** Kill leftover white slogan / old ₿ in the chest so only the new stamp remains. */
function eraseOldPrint(raw, kind) {
  const { data, width: w, height: h } = raw;
  const bg = backgroundMask(data, w, h);
  const pool = fabricPool(data, w, h, bg);
  if (pool.length < 30) return raw;
  const n = pool.length / 3;
  let clothL = 0;
  for (let i = 0; i < pool.length; i += 3) {
    clothL += rgbToHsl(pool[i], pool[i + 1], pool[i + 2])[2];
  }
  clothL /= n;
  const top = kind === "hoodie" ? Math.floor(h * 0.2) : Math.floor(h * 0.18);
  const bottom = kind === "hoodie" ? Math.floor(h * 0.6) : Math.floor(h * 0.64);
  const left = Math.floor(w * 0.2);
  const right = Math.floor(w * 0.8);
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      const i = y * w + x;
      if (bg[i]) continue;
      const o = i * 4;
      const [hue, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
      const deg = hue * 360;
      const oldMark = deg >= 16 && deg <= 48 && s > 0.35 && l > 0.22 && l < 0.8;
      const oldType = s < 0.4 && l > clothL + 0.08;
      if (!oldMark && !oldType) continue;
      const pick = Math.floor((Math.abs(Math.sin(x * 7.1 + y * 13.7)) * 23311) % n);
      const po = pick * 3;
      data[o] = pool[po];
      data[o + 1] = pool[po + 1];
      data[o + 2] = pool[po + 2];
    }
  }
  return raw;
}

function printSvg(lines, markOnly) {
  const longest = lines.reduce((n, s) => Math.max(n, s.length), 0);
  const size = markOnly ? 0 : longest > 14 ? 34 : longest > 10 ? 40 : 46;
  const startY = markOnly ? 0 : 560;
  const lineH = size + 6;
  const tspans = lines
    .map((line, i) => {
      const y = startY + i * lineH;
      return `<text x="512" y="${y}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${size}" fill="#F4F1EA" letter-spacing="2">${escapeXml(line)}</text>`;
    })
    .join("");
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <style>@font-face { font-family: Inter; src: url('file://${FONT}'); font-weight: 700; }</style>
  ${tspans}
</svg>`);
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&apos;");
}

async function toPng(raw) {
  return sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
    .png()
    .toBuffer();
}

async function renderOne(spec, kind, markPng) {
  const tmpl = kind === "hoodie" ? HOODIE_TMPL : PULLOVER_TMPL;
  let raw = await loadRaw(tmpl);
  raw = coverPrint(raw, kind === "hoodie" ? "hoodie" : "pullover");
  raw = eraseOldPrint(raw, kind === "hoodie" ? "hoodie" : "pullover");
  raw = recolorGarment(raw, spec.hex);
  const base = await toPng(raw);
  const markW = spec.markOnly ? 280 : 168;
  const markTop = kind === "hoodie" ? (spec.markOnly ? 268 : 278) : spec.markOnly ? 250 : 268;
  const layers = [
    {
      input: await sharp(markPng).resize({ width: markW }).png().toBuffer(),
      left: Math.round(512 - markW / 2),
      top: markTop,
    },
  ];
  if (!spec.markOnly && spec.lines.length) {
    layers.push({ input: await sharp(printSvg(spec.lines, false)).png().toBuffer(), left: 0, top: 0 });
  }
  const out = path.join(OUT, spec.file);
  await sharp(base).composite(layers).png().toFile(out);
  return out;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  lockTemplates();
  const markPng = await officialMarkPng("b", 320);
  const jobs = [
    ...HOODIES.map((s) => ({ spec: s, kind: "hoodie" })),
    ...PULLOVERS.map((s) => ({ spec: s, kind: "pullover" })),
  ].filter((j) => !only.length || only.includes(j.spec.file));
  for (const job of jobs) {
    const out = await renderOne(job.spec, job.kind, markPng);
    console.log("wrote", path.relative(ROOT, out));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
