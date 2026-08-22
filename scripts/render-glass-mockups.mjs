/**
 * Stamp a unique ₿ + slogan onto blank whiskey / shot studio templates.
 * Solid Inter, official clockwise ₿. No distressed type.
 */
import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { PRINT_INK, markStamp, sloganPng } from "./lib/studio-render.mjs";
import { sayingJobs } from "./lib/load-sayings.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/products");
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

async function renderOne(spec, kind) {
  const tmpl = kind === "shot" ? SHOT : WHISKEY;
  const markW = kind === "shot" ? 128 : 180;
  const markTop = kind === "shot" ? 328 : 286;
  const startY = kind === "shot" ? 478 : 498;
  const layers = [
    {
      input: await markStamp(markW),
      left: Math.round(512 - markW / 2),
      top: markTop,
    },
    {
      input: await sloganPng(spec.lines, {
        fill: spec.fill === "#F7931A" ? "#F7931A" : PRINT_INK,
        face: spec.face,
        startY,
        canvas: 1024,
      }),
      left: 0,
      top: 0,
    },
  ];
  const out = path.join(OUT, spec.file);
  await sharp(tmpl).resize(1024, 1024, { fit: "cover" }).composite(layers).png({ compressionLevel: 9 }).toFile(out);
  return out;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const jobs = [
    ...WHISKEYS.map((s) => ({ spec: s, kind: "whiskey" })),
    ...sayingJobs("whiskey").map((s) => ({ spec: s, kind: "whiskey" })),
    ...SHOTS.map((s) => ({ spec: s, kind: "shot" })),
    ...sayingJobs("shot").map((s) => ({ spec: s, kind: "shot" })),
  ].filter((j) => !only.length || only.includes(j.spec.file));
  for (const job of jobs) {
    const out = await renderOne(job.spec, job.kind);
    console.log("wrote", path.relative(ROOT, out));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
