/**
 * Rebuild tee / long-sleeve catalog shots from ghost templates.
 * Erase the old chest print, stamp official ₿ (visible clockwise lean) + Inter slogan.
 */
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { garmentMarkPng } from "./lib/official-bitcoin-mark.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/products");
const FONT = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf";
const TMPL_DIR = path.join(ROOT, "public/templates");
const TEE_TMPL = path.join(TMPL_DIR, "tee-ghost.png");
const LS_TMPL = path.join(TMPL_DIR, "longsleeve-ghost.png");

function lockTemplates() {
  mkdirSync(TMPL_DIR, { recursive: true });
  const teeSrc = path.join(OUT, "hodl-tee-ink.png");
  const lsSrc = path.join(OUT, "verify-longsleeve.png");
  if (!existsSync(TEE_TMPL) && existsSync(teeSrc)) copyFileSync(teeSrc, TEE_TMPL);
  if (!existsSync(LS_TMPL) && existsSync(lsSrc)) copyFileSync(lsSrc, LS_TMPL);
}

const TEES = [
  { file: "bitcoin-daddy-tee.png", lines: ["BITCOIN", "DADDY"], hex: "#0B0C0E" },
  { file: "bitcoin-mummy-tee.png", lines: ["BITCOIN", "MUMMY"], hex: "#1B2430" },
  { file: "hodl-tee.png", lines: ["I AM", "HODLING"], hex: "#3A3D42" },
  { file: "hodl-tee-ink.png", lines: ["I AM", "HODLING"], hex: "#0B0C0E" },
  { file: "hodl-tee-navy.png", lines: ["I AM", "HODLING"], hex: "#1B2430" },
  { file: "strategic-reserve-tee.png", lines: ["STRATEGIC", "RESERVE"], hex: "#1B2430" },
  { file: "hard-money-tee.png", lines: ["HARD", "MONEY"], hex: "#8A8D92" },
  { file: "proof-tweet-tee.png", lines: ["PROOF OF WORK", "NOT PROOF OF TWEET"], hex: "#6B1D2A" },
  { file: "btc-b-tee.png", lines: [], hex: "#0B0C0E", markOnly: true },
  { file: "women-btc-tee.png", lines: [], hex: "#0B0C0E", markOnly: true, markSmall: true },
  { file: "so-back-tee.png", lines: ["WE ARE", "SO BACK"], hex: "#0B0C0E" },
  { file: "no-laser-tee.png", lines: ["NO LASER", "EYES"], hex: "#1B2430" },
  { file: "cant-print-tee.png", lines: ["CAN'T", "PRINT THIS"], hex: "#3A3D42" },
  { file: "satoshi-tee.png", lines: ["SATOSHI", "WAS HERE"], hex: "#0B0C0E" },
  { file: "verify-meme-tee.png", lines: ["DON'T TRUST.", "VERIFY."], hex: "#1B2430" },
  { file: "women-crop.png", lines: ["STACK", "SATS"], hex: "#0B0C0E" },
  { file: "women-tank.png", lines: ["STACK", "SATS"], hex: "#6B1D2A" },
  { file: "women-vneck.png", lines: [], hex: "#0B0C0E", markOnly: true, markSmall: true },
  { file: "youth-utxo-tee.png", lines: ["FUTURE", "UTXO"], hex: "#1B2430" },
  { file: "so-over-tee.png", lines: ["IT'S SO", "OVER"], hex: "#1B2430" },
  { file: "fiat-experiment-tee.png", lines: ["FIAT IS THE", "EXPERIMENT"], hex: "#3A3D42" },
  { file: "quantum-tee.png", lines: ["QUANTUM", "CAN WAIT"], hex: "#0B0C0E" },
  { file: "orange-pill-tee.png", lines: ["ORANGE", "PILL"], hex: "#0B0C0E" },
  { file: "not-forecast-tee.png", lines: ["NOT A", "FORECAST"], hex: "#1B2430" },
  { file: "stay-humble-tee.png", lines: ["STAY HUMBLE", "STACK SATS"], hex: "#2D5A3D" },
  { file: "genesis-2009-tee.png", lines: ["GENESIS", "03 JAN 2009"], hex: "#0B0C0E" },
  { file: "low-time-tee.png", lines: ["LOW TIME", "PREFERENCE"], hex: "#1B2430" },
  { file: "stack-sats-tee.png", lines: ["STACK", "SATS"], hex: "#2D5A3D" },
  { file: "few-understand-tee.png", lines: ["FEW", "UNDERSTAND"], hex: "#0B0C0E" },
  { file: "fixes-this-tee.png", lines: ["BITCOIN", "FIXES THIS"], hex: "#1B2430" },
  { file: "one-btc-tee.png", lines: ["1 BTC", "= 1 BTC"], hex: "#3A3D42" },
  { file: "21-million-tee.png", lines: ["21", "MILLION"], hex: "#0B0C0E" },
  { file: "no-second-tee.png", lines: ["NO SECOND", "BEST"], hex: "#6B1D2A" },
  { file: "whitepaper-tee.png", lines: ["PEER-TO-PEER", "ELECTRONIC CASH"], hex: "#1B2430" },
  { file: "gradually-tee.png", lines: ["GRADUALLY,", "THEN SUDDENLY"], hex: "#0B0C0E" },
  { file: "nyknyc-tee.png", lines: ["NOT YOUR KEYS", "NOT YOUR COINS"], hex: "#1B2430" },
  { file: "finite-tee.png", lines: ["INFINITE FIAT", "FINITE BITCOIN"], hex: "#3A3D42" },
  { file: "run-node-tee.png", lines: ["RUN YOUR", "NODE"], hex: "#0B0C0E" },
  { file: "ngu-tee.png", lines: ["NUMBER", "GO UP"], hex: "#1B2430" },
  { file: "dip-feature-tee.png", lines: ["THE DIP IS", "THE FEATURE"], hex: "#2D5A3D" },
  { file: "joke-21-tee.png", lines: ["21 MILLION.", "THAT'S THE JOKE."], hex: "#0B0C0E" },
];

const LONGSLEEVES = [
  { file: "bitcoin-daddy-longsleeve.png", lines: ["BITCOIN", "DADDY"], hex: "#1B2430" },
  { file: "bitcoin-mummy-longsleeve.png", lines: ["BITCOIN", "MUMMY"], hex: "#3A3D42" },
  { file: "verify-longsleeve.png", lines: ["DON'T TRUST.", "VERIFY."], hex: "#0B0C0E" },
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
  const { data, info } = await sharp(file)
    .resize(1024, 1024, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
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
  const bg = backgroundMask(data, w, h);
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
    [0.16, 0.28, 0.22, 0.34],
    [0.72, 0.84, 0.22, 0.34],
    [0.12, 0.22, 0.42, 0.58],
    [0.78, 0.88, 0.42, 0.58],
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

function coverPrint(raw) {
  const { data, width: w, height: h } = raw;
  const bg = backgroundMask(data, w, h);
  const pool = fabricPool(data, w, h, bg);
  if (pool.length < 30) return raw;
  const cx = w * 0.5;
  const cy = h * 0.36;
  const rx = w * 0.3;
  const ry = h * 0.22;
  const n = pool.length / 3;
  for (let y = Math.floor(cy - ry * 1.3); y < cy + ry * 1.3; y++) {
    for (let x = Math.floor(cx - rx * 1.3); x < cx + rx * 1.3; x++) {
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

function eraseOldPrint(raw) {
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
  const top = Math.floor(h * 0.16);
  const bottom = Math.floor(h * 0.62);
  const left = Math.floor(w * 0.18);
  const right = Math.floor(w * 0.82);
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

function printSvg(lines) {
  const longest = lines.reduce((n, s) => Math.max(n, s.length), 0);
  const size = longest > 16 ? 32 : longest > 12 ? 38 : 44;
  const startY = 520;
  const lineH = size + 8;
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
  const tmpl = kind === "tee" ? TEE_TMPL : LS_TMPL;
  let raw = await loadRaw(tmpl);
  raw = coverPrint(raw);
  raw = eraseOldPrint(raw);
  raw = recolorGarment(raw, spec.hex);
  const base = await toPng(raw);
  const markW = spec.markOnly ? (spec.markSmall ? 96 : 260) : 168;
  const markTop = spec.markOnly ? (spec.markSmall ? 300 : 250) : 248;
  const layers = [
    {
      input: await sharp(markPng).resize({ width: markW }).png().toBuffer(),
      left: Math.round(512 - markW / 2),
      top: markTop,
    },
  ];
  if (!spec.markOnly && spec.lines.length) {
    layers.push({ input: await sharp(printSvg(spec.lines)).png().toBuffer(), left: 0, top: 0 });
  }
  const out = path.join(OUT, spec.file);
  await sharp(base).composite(layers).png().toFile(out);
  return out;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  lockTemplates();
  if (!existsSync(TEE_TMPL)) throw new Error("tee-ghost template missing");
  if (!existsSync(LS_TMPL)) throw new Error("longsleeve-ghost template missing");
  const markPng = await garmentMarkPng(320);
  const jobs = [
    ...TEES.map((s) => ({ spec: s, kind: "tee" })),
    ...LONGSLEEVES.map((s) => ({ spec: s, kind: "ls" })),
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
