/** Server / QA only. Parse expected slogan lines from the mockup renderers. */
import { readFileSync } from "fs";
import path from "path";

const ROOT = process.cwd();

const RENDER_SCRIPTS = [
  "scripts/render-tee-mockups.mjs",
  "scripts/render-sweat-mockups.mjs",
  "scripts/render-glass-mockups.mjs",
  "scripts/render-polo-mockups.mjs",
] as const;

export type PrintSpec = {
  file: string;
  lines: string[];
  markOnly: boolean;
};

function parseLines(raw: string): string[] {
  return [...raw.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

function specsFromSayings(): PrintSpec[] {
  const src = readFileSync(path.join(ROOT, "lib/sayings.json"), "utf8");
  const marks = JSON.parse(src).marks as Record<string, unknown>[];
  const kinds = ["tee", "hoodie", "pullover", "whiskey", "shot"] as const;
  const specs: PrintSpec[] = [];
  for (const m of marks) {
    const stem = String(m.file ?? m.id);
    for (const kind of kinds) {
      const lines = (m[kind] as string[] | undefined) ?? (m.tee as string[]);
      specs.push({ file: `${stem}-${kind}.png`, lines: lines ?? [], markOnly: false });
    }
  }
  return specs;
}

export function printSpecsFromRenderers(): PrintSpec[] {
  const specs: PrintSpec[] = [];
  for (const rel of RENDER_SCRIPTS) {
    const src = readFileSync(path.join(ROOT, rel), "utf8");
    const blocks = src.matchAll(/\{\s*file:\s*"([^"]+\.png)"([^}]*)\}/g);
    for (const block of blocks) {
      const file = block[1];
      const body = block[2];
      const lineChunk = body.match(/lines:\s*\[([^\]]*)\]/);
      const lines = lineChunk ? parseLines(lineChunk[1]) : [];
      const markOnly = /markOnly:\s*true/.test(body) || lines.length === 0;
      specs.push({ file, lines, markOnly });
    }
  }
  return [...specs, ...specsFromSayings()];
}

export function printSpecForFile(file: string): PrintSpec | undefined {
  return printSpecsFromRenderers().find((s) => s.file === file);
}

export function normalizeSlogan(s: string) {
  return s
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
