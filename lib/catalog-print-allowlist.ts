/** Server / QA only. Do not import from client components — uses fs. */
import { readFileSync } from "fs";
import path from "path";
import type { Product } from "./products";

const ROOT = process.cwd();

const RENDER_SCRIPTS = [
  "scripts/render-tee-mockups.mjs",
  "scripts/render-sweat-mockups.mjs",
  "scripts/render-glass-mockups.mjs",
  "scripts/render-polo-mockups.mjs",
] as const;

/** Real studio photo that already has official clockwise ₿ + readable type. */
const PHOTO_OK = new Set(["21m-hat.png"]);

function filesFromRenderer(rel: string): string[] {
  const src = readFileSync(path.join(ROOT, rel), "utf8");
  return [...src.matchAll(/file:\s*"([^"]+\.png)"/g)].map((m) => m[1]);
}

function filesFromSayings(): string[] {
  const src = readFileSync(path.join(ROOT, "lib/sayings.json"), "utf8");
  const marks = JSON.parse(src).marks as { id: string }[];
  const kinds = ["tee", "hoodie", "pullover", "whiskey", "shot"] as const;
  return marks.flatMap((m) => kinds.map((k) => `${m.id}-${k}.png`));
}

export function allowedPrintFilenames(): Set<string> {
  const files = new Set<string>(PHOTO_OK);
  for (const script of RENDER_SCRIPTS) {
    for (const file of filesFromRenderer(script)) files.add(file);
  }
  for (const file of filesFromSayings()) files.add(file);
  return files;
}

export type PrintSourceIssue = {
  slug: string;
  name: string;
  image: string;
  detail: string;
};

function imageFile(image: string): string {
  return path.basename(image);
}

/** Live catalog photos must be renderer output (or the one approved studio hat). */
export function auditPrintSources(products: Product[]): PrintSourceIssue[] {
  const allowed = allowedPrintFilenames();
  const issues: PrintSourceIssue[] = [];
  for (const p of products) {
    const shots = [p.image, ...Object.values(p.imagesByColor ?? {})].filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    for (const image of shots) {
      const file = imageFile(image);
      if (allowed.has(file)) continue;
      issues.push({
        slug: p.slug,
        name: p.name,
        image,
        detail: `${file} is not from render-tee / render-sweat / render-glass (or the 21M dad hat). Rebuild from a ghost template or retire the SKU. Do not stamp a sticker on a bad photo.`,
      });
    }
  }
  return issues;
}
