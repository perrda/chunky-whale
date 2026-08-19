/**
 * Build unique square hoodie / pullover catalog shots from existing
 * ghost-mannequin templates. Covers the old chest print and stamps a
 * new ₿ + slogan so Pullovers never reuse a hoodie photo.
 */
import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { officialMarkPng } from "./lib/official-bitcoin-mark.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/products");
const FONT = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf";

const PULLOVER_TMPL = path.join(ROOT, "public/products/21m-pullover.png");
const HOODIE_TMPL = path.join(ROOT, "public/products/hodl-hoodie.png");

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

function coverPrint(raw, kind) {
  const { data, width: w, height: h } = raw;
  const left = kind === "hoodie" ? 250 : 320;
  const right = kind === "hoodie" ? 780 : 720;
  const top = kind === "hoodie" ? 200 : 180;
  const bottom = kind === "hoodie" ? 640 : 640;
  const bg = backgroundMask(data, w, h);
  const [sr, sg, sb] = sampleShoulder(data, w, h);
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      const i = y * w + x;
      if (bg[i]) continue;
      const o = i * 4;
      data[o] = sr;
      data[o + 1] = sg;
      data[o + 2] = sb;
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
