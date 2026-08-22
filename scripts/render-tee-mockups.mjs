/**
 * Rebuild tee / long-sleeve catalog shots from a blank ghost.
 * Official ₿ (clockwise) + solid Inter. No distressed leftovers.
 */
import { existsSync, mkdirSync } from "fs";
import path from "path";
import {
  INK,
  OUT,
  TMPL_DIR,
  blankChest,
  loadRaw,
  renderApparel,
  toPng,
} from "./lib/studio-render.mjs";
import { sayingJobs } from "./lib/load-sayings.mjs";
import sharp from "sharp";

const ROOT = process.cwd();
const TEE_BLANK = path.join(TMPL_DIR, "tee-blank.png");
const LS_BLANK = path.join(TMPL_DIR, "longsleeve-blank.png");

const TEES = [
  { file: "bitcoin-daddy-tee.png", lines: ["BITCOIN", "DADDY"] },
  { file: "bitcoin-mummy-tee.png", lines: ["BITCOIN", "MUMMY"] },
  { file: "hodl-tee.png", lines: ["I AM", "HODLING"] },
  { file: "hodl-tee-ink.png", lines: ["I AM", "HODLING"] },
  { file: "hodl-tee-navy.png", lines: ["I AM", "HODLING"], hex: "#1B2430" },
  { file: "strategic-reserve-tee.png", lines: ["STRATEGIC", "RESERVE"] },
  { file: "hard-money-tee.png", lines: ["HARD", "MONEY"] },
  { file: "proof-tweet-tee.png", lines: ["PROOF OF WORK", "NOT PROOF OF TWEET"] },
  { file: "btc-b-tee.png", lines: [], markOnly: true },
  { file: "quiet-b-tee.png", lines: [], markOnly: true },
  { file: "crest-b-tee.png", lines: [], markOnly: true, layout: "crest" },
  { file: "women-btc-tee.png", lines: [], markOnly: true, markSmall: true },
  { file: "so-back-tee.png", lines: ["WE ARE", "SO BACK"] },
  { file: "no-laser-tee.png", lines: ["NO LASER", "EYES"] },
  { file: "cant-print-tee.png", lines: ["CAN'T", "PRINT THIS"] },
  { file: "satoshi-tee.png", lines: ["SATOSHI", "WAS HERE"] },
  { file: "verify-meme-tee.png", lines: ["DON'T TRUST.", "VERIFY."] },
  { file: "women-crop.png", lines: ["STACK", "SATS"] },
  { file: "women-tank.png", lines: ["STACK", "SATS"] },
  { file: "women-vneck.png", lines: [], markOnly: true, markSmall: true },
  { file: "youth-utxo-tee.png", lines: ["FUTURE", "UTXO"] },
  { file: "so-over-tee.png", lines: ["IT'S SO", "OVER"] },
  { file: "fiat-experiment-tee.png", lines: ["FIAT IS THE", "EXPERIMENT"] },
  { file: "quantum-tee.png", lines: ["QUANTUM", "CAN WAIT"] },
  { file: "orange-pill-tee.png", lines: ["ORANGE", "PILL"] },
  { file: "not-forecast-tee.png", lines: ["NOT A", "FORECAST"] },
  { file: "stay-humble-tee.png", lines: ["STAY HUMBLE", "STACK SATS"] },
  { file: "genesis-2009-tee.png", lines: ["GENESIS", "03 JAN 2009"] },
  { file: "low-time-tee.png", lines: ["LOW TIME", "PREFERENCE"] },
  { file: "stack-sats-tee.png", lines: ["STACK", "SATS"] },
  { file: "few-understand-tee.png", lines: ["FEW", "UNDERSTAND"] },
  { file: "fixes-this-tee.png", lines: ["BITCOIN", "FIXES THIS"] },
  { file: "one-btc-tee.png", lines: ["1 BTC", "= 1 BTC"] },
  { file: "21-million-tee.png", lines: ["21", "MILLION"] },
  { file: "no-second-tee.png", lines: ["THERE IS NO", "SECOND BEST"] },
  { file: "whitepaper-tee.png", lines: ["PEER-TO-PEER", "ELECTRONIC CASH"] },
  { file: "gradually-tee.png", lines: ["GRADUALLY,", "THEN SUDDENLY"] },
  { file: "nyknyc-tee.png", lines: ["NOT YOUR KEYS", "NOT YOUR COINS"] },
  { file: "finite-tee.png", lines: ["INFINITE FIAT", "FINITE BITCOIN"] },
  { file: "run-node-tee.png", lines: ["RUN YOUR", "NODE"] },
  { file: "ngu-tee.png", lines: ["NUMBER", "GO UP"] },
  { file: "dip-feature-tee.png", lines: ["THE DIP IS", "THE FEATURE"] },
  { file: "joke-21-tee.png", lines: ["21 MILLION.", "THAT'S THE JOKE."] },
];

const LONGSLEEVES = [
  { file: "bitcoin-daddy-longsleeve.png", lines: ["BITCOIN", "DADDY"] },
  { file: "bitcoin-mummy-longsleeve.png", lines: ["BITCOIN", "MUMMY"] },
  { file: "verify-longsleeve.png", lines: ["DON'T TRUST.", "VERIFY."] },
];

async function ensureBlank(kind) {
  mkdirSync(TMPL_DIR, { recursive: true });
  const dest = kind === "ls" ? LS_BLANK : TEE_BLANK;
  if (existsSync(dest)) return dest;
  const src =
    kind === "ls"
      ? [path.join(TMPL_DIR, "longsleeve-ghost.png"), path.join(OUT, "verify-longsleeve.png")]
      : [path.join(TMPL_DIR, "tee-ghost.png"), path.join(OUT, "hodl-tee-ink.png")];
  const hit = src.find((f) => existsSync(f));
  if (!hit) throw new Error(`${kind} template source missing`);
  let raw = await loadRaw(hit);
  raw = await blankChest(raw, kind === "ls" ? "ls" : "tee");
  await sharp(await toPng(raw)).png().toFile(dest);
  return dest;
}

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const teeTmpl = await ensureBlank("tee");
  const lsTmpl = await ensureBlank("ls");
  const jobs = [
    ...TEES.map((s) => ({ spec: s, kind: "tee", tmpl: teeTmpl })),
    ...sayingJobs("tee").map((s) => ({ spec: s, kind: "tee", tmpl: teeTmpl })),
    ...LONGSLEEVES.map((s) => ({ spec: s, kind: "ls", tmpl: lsTmpl })),
  ].filter((j) => !only.length || only.includes(j.spec.file));
  for (const job of jobs) {
    const out = path.join(OUT, job.spec.file);
    await renderApparel({
      template: job.tmpl,
      outFile: out,
      lines: job.spec.lines,
      hex: job.spec.hex ?? INK,
      kind: job.kind,
      markOnly: job.spec.markOnly,
      markSmall: job.spec.markSmall,
      fill: job.spec.fill,
      face: job.spec.face,
      layout: job.spec.layout,
    });
    console.log("wrote", path.relative(ROOT, out));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
