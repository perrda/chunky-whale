/**
 * Stamp a unique ₿ + slogan onto blank whiskey / shot studio templates.
 */
import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { garmentMarkPng } from "./lib/official-bitcoin-mark.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/products");
const FONT = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf";
const PINT = path.join(ROOT, "public/products/hard-money-pint.png");
const WHISKEY = path.join(ROOT, "public/products/whiskey-blank.png");
const SHOT = path.join(ROOT, "public/products/shot-blank.png");

export const WHISKEYS = [
  { file: "hodl-whiskey.png", lines: ["I AM", "HODLING"] },
  { file: "stack-sats-whiskey.png", lines: ["STACK", "SATS"] },
  { file: "hard-money-whiskey.png", lines: ["HARD", "MONEY"] },
  { file: "21m-whiskey.png", lines: ["21", "MILLION"] },
  { file: "few-understand-whiskey.png", lines: ["FEW", "UNDERSTAND"] },
  { file: "one-btc-whiskey.png", lines: ["1 BTC", "= 1 BTC"] },
  { file: "verify-whiskey.png", lines: ["DON'T TRUST.", "VERIFY."] },
  { file: "satoshi-whiskey.png", lines: ["SATOSHI", "WAS HERE"] },
  { file: "not-your-keys-whiskey.png", lines: ["NOT YOUR", "KEYS"] },
  { file: "sound-money-whiskey.png", lines: ["SOUND", "MONEY"] },
  { file: "cold-storage-whiskey.png", lines: ["COLD", "STORAGE"] },
  { file: "proof-of-work-whiskey.png", lines: ["PROOF OF", "WORK"] },
  { file: "dip-feature-whiskey.png", lines: ["THE DIP IS", "THE FEATURE"] },
  { file: "low-time-whiskey.png", lines: ["LOW TIME", "PREFERENCE"] },
  { file: "stay-solvent-whiskey.png", lines: ["STAY", "SOLVENT"] },
  { file: "peer-to-peer-whiskey.png", lines: ["PEER", "TO PEER"] },
  { file: "genesis-whiskey.png", lines: ["GENESIS", "03 JAN 2009"] },
  { file: "infinite-fiat-whiskey.png", lines: ["INFINITE", "FIAT"] },
  { file: "run-node-whiskey.png", lines: ["RUN YOUR", "NODE"] },
  { file: "orange-pill-whiskey.png", lines: ["ORANGE", "PILL"] },
];

export const SHOTS = [
  { file: "hodl-shot.png", lines: ["HODL"] },
  { file: "stack-sats-shot.png", lines: ["STACK", "SATS"] },
  { file: "one-sat-shot.png", lines: ["ONE", "SAT"] },
  { file: "verify-shot.png", lines: ["VERIFY"] },
  { file: "21m-shot.png", lines: ["21M"] },
  { file: "hard-cap-shot.png", lines: ["HARD", "CAP"] },
  { file: "no-second-shot.png", lines: ["NO SECOND", "BEST"] },
  { file: "keys-shot.png", lines: ["KEYS"] },
  { file: "node-shot.png", lines: ["NODE"] },
  { file: "utxo-shot.png", lines: ["UTXO"] },
  { file: "mempool-shot.png", lines: ["MEMPOOL"] },
  { file: "one-more-block-shot.png", lines: ["ONE MORE", "BLOCK"] },
  { file: "orange-shot.png", lines: ["ORANGE"] },
  { file: "finite-shot.png", lines: ["FINITE"] },
  { file: "self-custody-shot.png", lines: ["SELF", "CUSTODY"] },
  { file: "stay-humble-shot.png", lines: ["STAY", "HUMBLE"] },
  { file: "number-go-up-shot.png", lines: ["NUMBER", "GO UP"] },
  { file: "cant-print-shot.png", lines: ["CAN'T", "PRINT THIS"] },
  { file: "bitcoin-fixes-shot.png", lines: ["BITCOIN", "FIXES THIS"] },
  { file: "the-joke-shot.png", lines: ["THAT'S", "THE JOKE"] },
];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&apos;");
}

function printSvg(lines, kind) {
  const longest = lines.reduce((n, s) => Math.max(n, s.length), 1);
  const size = kind === "shot" ? (longest > 9 ? 26 : longest > 6 ? 30 : 36) : longest > 11 ? 32 : longest > 8 ? 36 : 40;
  const startY = kind === "shot" ? 548 : 540;
  const lineH = size + 6;
  const tspans = lines
    .map((line, i) => {
      const y = startY + i * lineH;
      return `<text x="512" y="${y}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${size}" fill="#161616" letter-spacing="1.5">${escapeXml(line)}</text>`;
    })
    .join("");
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <style>@font-face { font-family: Inter; src: url('file://${FONT}'); font-weight: 700; }</style>
  ${tspans}
</svg>`);
}

async function renderOne(spec, kind, markPng) {
  const tmpl = kind === "shot" ? SHOT : WHISKEY;
  const markW = kind === "shot" ? 120 : 168;
  const markTop = kind === "shot" ? 340 : 300;
  const layers = [
    {
      input: await sharp(markPng).resize({ width: markW }).png().toBuffer(),
      left: Math.round(512 - markW / 2),
      top: markTop,
    },
    { input: await sharp(printSvg(spec.lines, kind)).png().toBuffer(), left: 0, top: 0 },
  ];
  const out = path.join(OUT, spec.file);
  await sharp(tmpl).composite(layers).png().toFile(out);
  return out;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const markPng = await garmentMarkPng(280);
  const jobs = [
    ...WHISKEYS.map((s) => ({ spec: s, kind: "whiskey" })),
    ...SHOTS.map((s) => ({ spec: s, kind: "shot" })),
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
