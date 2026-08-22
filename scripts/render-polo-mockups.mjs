/**
 * Formal polo shots — official ₿ only, stitched, quiet.
 * No slogans. No FOMO21. Nothing flashy.
 */
import { mkdirSync } from "fs";
import path from "path";
import { OUT, renderPolo } from "./lib/studio-render.mjs";

const ROOT = process.cwd();

const POLOS = [
  { file: "polo-crest.png", place: "crest" },
  { file: "polo-center.png", place: "center" },
  { file: "polo-mini.png", place: "mini" },
];

const only = process.argv.slice(2);

async function main() {
  mkdirSync(OUT, { recursive: true });
  for (const spec of POLOS) {
    if (only.length && !only.includes(spec.file)) continue;
    const out = path.join(OUT, spec.file);
    await renderPolo({ outFile: out, place: spec.place });
    console.log("wrote", path.relative(ROOT, out));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
