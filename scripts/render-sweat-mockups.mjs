/**
 * Unique square hoodie / pullover shots from a blank ghost.
 * Official ₿ + solid Inter. Never a hoodie photo on a pullover.
 */
import { existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import {
  INK,
  OUT,
  TMPL_DIR,
  blankChest,
  loadRaw,
  renderApparel,
  toPng,
} from "./lib/studio-render.mjs";

const ROOT = process.cwd();
const PULLOVER_BLANK = path.join(TMPL_DIR, "pullover-blank.png");
const HOODIE_BLANK = path.join(TMPL_DIR, "hoodie-blank.png");

const HOODIES = [
  { file: "so-back-hoodie.png", lines: ["WE ARE", "SO BACK"] },
  { file: "so-over-hoodie.png", lines: ["IT'S SO", "OVER"] },
  { file: "no-forecast-hoodie.png", lines: ["NOT A", "FORECAST"] },
  { file: "stay-humble-hoodie.png", lines: ["STAY", "HUMBLE"] },
  { file: "proof-of-work-hoodie.png", lines: ["PROOF OF", "WORK"] },
  { file: "not-your-keys-hoodie.png", lines: ["NOT YOUR", "KEYS"] },
  { file: "hard-money-hoodie.png", lines: ["HARD", "MONEY"] },
  { file: "verify-hoodie.png", lines: ["DON'T TRUST.", "VERIFY."] },
  { file: "few-understand-hoodie.png", lines: ["FEW", "UNDERSTAND"] },
  { file: "hodl-hoodie.png", lines: ["I AM", "HODLING"] },
  { file: "hodl-hoodie-navy.png", lines: ["I AM", "HODLING"], hex: "#1B2430" },
  { file: "bitcoin-daddy-hoodie.png", lines: ["BITCOIN", "DADDY"] },
  { file: "bitcoin-mummy-hoodie.png", lines: ["BITCOIN", "MUMMY"] },
  { file: "four-year-hoodie.png", lines: ["FOUR YEAR", "TIDE"] },
  { file: "21m-hoodie.png", lines: ["21", "MILLION"] },
  { file: "timechain-hoodie.png", lines: ["TIMECHAIN"] },
  { file: "stack-sats-hoodie.png", lines: ["STACK", "SATS"] },
  { file: "digital-energy-hoodie.png", lines: ["DIGITAL", "ENERGY"] },
  { file: "sound-money-hoodie.png", lines: ["SOUND", "MONEY"] },
  { file: "self-custody-hoodie.png", lines: ["SELF", "CUSTODY"] },
  { file: "b-mark-hoodie.png", lines: [], markOnly: true },
  { file: "embroidered-b-hoodie-navy.png", lines: [], markOnly: true, hex: "#1B2430" },
];

const PULLOVERS = [
  { file: "no-laser-pullover.png", lines: ["NO LASER", "EYES"] },
  { file: "orange-pill-pullover.png", lines: ["ORANGE", "PILL"] },
  { file: "hodl-pullover.png", lines: ["I AM", "HODLING"] },
  { file: "stack-sats-pullover.png", lines: ["STACK", "SATS"] },
  { file: "timechain-pullover.png", lines: ["TIMECHAIN"] },
  { file: "digital-energy-pullover.png", lines: ["DIGITAL", "ENERGY"] },
  { file: "four-year-pullover.png", lines: ["FOUR YEAR", "TIDE"] },
  { file: "b-mark-pullover.png", lines: [], markOnly: true },
  { file: "stay-humble-pullover.png", lines: ["STAY HUMBLE", "STACK SATS"] },
  { file: "proof-of-work-pullover.png", lines: ["PROOF OF", "WORK"] },
  { file: "not-your-keys-pullover.png", lines: ["NOT YOUR KEYS", "NOT YOUR COINS"] },
  { file: "hard-money-pullover.png", lines: ["HARD", "MONEY"] },
  { file: "sound-money-pullover.png", lines: ["SOUND", "MONEY"] },
  { file: "cold-storage-pullover.png", lines: ["COLD", "STORAGE"] },
  { file: "self-custody-pullover.png", lines: ["SELF", "CUSTODY"] },
  { file: "verify-pullover.png", lines: ["DON'T TRUST.", "VERIFY."] },
  { file: "few-understand-pullover.png", lines: ["FEW", "UNDERSTAND"] },
  { file: "bitcoin-mummy-pullover.png", lines: ["BITCOIN", "MUMMY"] },
  { file: "bitcoin-daddy-pullover.png", lines: ["BITCOIN", "DADDY"] },
  { file: "21m-pullover.png", lines: ["21", "MILLION"] },
  { file: "hodl-crew.png", lines: ["HODL"] },
];

async function ensureBlank(kind) {
  mkdirSync(TMPL_DIR, { recursive: true });
  const dest = kind === "hoodie" ? HOODIE_BLANK : PULLOVER_BLANK;
  if (existsSync(dest)) return dest;
  const src =
    kind === "hoodie"
      ? [path.join(TMPL_DIR, "hoodie-ghost.png"), path.join(OUT, "hodl-hoodie.png")]
      : [path.join(TMPL_DIR, "pullover-ghost.png"), path.join(OUT, "21m-pullover.png")];
  const hit = src.find((f) => existsSync(f));
  if (!hit) throw new Error(`${kind} template source missing`);
  let raw = await loadRaw(hit);
  raw = await blankChest(raw, kind === "hoodie" ? "hoodie" : "tee");
  await sharp(await toPng(raw)).png().toFile(dest);
  return dest;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const hoodieTmpl = await ensureBlank("hoodie");
  const pullTmpl = await ensureBlank("pullover");
  const jobs = [
    ...HOODIES.map((s) => ({ spec: s, kind: "hoodie", tmpl: hoodieTmpl })),
    ...PULLOVERS.map((s) => ({ spec: s, kind: "pullover", tmpl: pullTmpl })),
  ].filter((j) => !only.length || only.includes(j.spec.file));
  for (const job of jobs) {
    const out = path.join(OUT, job.spec.file);
    await renderApparel({
      template: job.tmpl,
      outFile: out,
      lines: job.spec.lines,
      hex: job.spec.hex ?? INK,
      kind: job.kind === "hoodie" ? "hoodie" : "tee",
      markOnly: job.spec.markOnly,
    });
    console.log("wrote", path.relative(ROOT, out));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
