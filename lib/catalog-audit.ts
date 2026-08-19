import { existsSync } from "fs";
import path from "path";
import { expectedPhotoKind, filenamePhotoKind, photoKindMismatch } from "./catalog-kind";
import { isStudioWhiteBackground } from "./catalog-studio";
import { products as allProducts, RETIRED_SLUGS, type Product } from "./products";

export { expectedPhotoKind, filenamePhotoKind, photoKindMismatch } from "./catalog-kind";

/** Canonical design family. Aliases collapse “humble-ps” and “stay-humble” to one mark. */
const FAMILY_ALIASES: Record<string, string> = {
  "humble-x": "stay-humble",
  "humble-ps": "stay-humble",
  "21m-x": "21-million",
  "21m-ps": "21-million",
  "21m": "21-million",
  "hodl-x": "hodl",
  "hodl-ps": "hodl",
  "keys-x": "keys",
  "keys-ps": "keys",
  "verify-x": "verify",
  "dip-x": "dip-feature",
  "dip-ps": "dip-feature",
  "node-x": "run-node",
  "stack-tumbler-green": "stack-sats",
  stack: "stack-sats",
  "infant-node-onesie": "infant-node",
  "youth-utxo": "utxo",
  "toddler-btc": "utxo",
  pow: "pow-tweet",
  fiat: "fiat-exp",
};

const MARK_PREFIXES = [
  "so-back",
  "so-over",
  "no-forecast",
  "no-laser",
  "pow-tweet",
  "fiat-exp",
  "orange-pill",
  "four-year",
  "timechain",
  "strategic-reserve",
  "reserve",
  "quantum",
  "printer",
  "stay-humble",
  "stack-sats",
  "21-million",
  "hard-money",
  "bitcoin-mummy",
  "bitcoin-daddy",
  "infant-node",
  "few-understand",
  "orange-daily",
  "future-utxo",
  "node-toddler",
  "verify",
  "hodl",
  "keys",
].sort((a, b) => b.length - a.length);

export function designFamily(product: Product): string {
  const slug = product.slug.toLowerCase().replace(
    /-(tee|hoodie|crew|zip|pullover|mug|tumbler|pint|coasters|tote|pack|hat|cap|beanie|poster|print|sticker|pin|pendant|bracelet|longsleeve|vneck|tank|crop|youth|toddler|infant|dad-hat|trucker-hat|bucket-hat|flexfit-hat|vintage-hat|distressed-hat|swim-shorts|board-shorts|bikini|one-piece|rash-guard|swim-cap|youth-swim|toddler-swim)$/i,
    "",
  );
  for (const mark of MARK_PREFIXES) {
    if (slug === mark || slug.startsWith(`${mark}-`)) {
      return FAMILY_ALIASES[mark] ?? mark;
    }
  }
  return FAMILY_ALIASES[slug] ?? FAMILY_ALIASES[slug.split("-")[0] ?? ""] ?? slug;
}

function imageKindHint(image: string): string | null {
  const base = path.basename(image, path.extname(image)).toLowerCase();
  return filenamePhotoKind(base);
}

function productObject(product: Product): string {
  const slug = product.slug.toLowerCase();
  if (slug.includes("tumbler")) return "tumbler";
  if (slug.includes("pint")) return "pint";
  if (slug.includes("coaster")) return "coaster";
  if (slug.includes("mug")) return "mug";
  if (slug.includes("tote")) return "tote";
  if (slug.includes("pack")) return "pack";
  if (slug.includes("pendant")) return "pendant";
  if (slug.includes("bracelet")) return "bracelet";
  if (product.kind) return product.kind.toLowerCase();
  return product.category;
}

const STRICT_OBJECTS = new Set([
  "mug",
  "tumbler",
  "pint",
  "coaster",
  "tote",
  "pack",
  "pendant",
  "bracelet",
]);

const OBJECT_OK: Record<string, string[]> = {
  mug: ["mug"],
  tumbler: ["tumbler"],
  pint: ["pint"],
  coaster: ["coaster"],
  tote: ["tote"],
  pack: ["pack"],
  pendant: ["pendant"],
  bracelet: ["bracelet"],
};

export type CatalogImageIssue = {
  severity: "error" | "warning";
  code: "missing-file" | "slogan-collision" | "kind-mismatch" | "studio-background";
  slug: string;
  name: string;
  image: string;
  detail: string;
};

export async function auditCatalogImages(
  products: Product[] = allProducts.filter((p) => !p.retired && !RETIRED_SLUGS.has(p.slug)),
  publicDir = path.join(process.cwd(), "public"),
): Promise<CatalogImageIssue[]> {
  const issues: CatalogImageIssue[] = [];
  const byImage = new Map<string, Product[]>();

  for (const p of products) {
    const rel = p.image.replace(/^\//, "");
    const abs = path.join(publicDir, rel);
    if (!existsSync(abs)) {
      issues.push({
        severity: "error",
        code: "missing-file",
        slug: p.slug,
        name: p.name,
        image: p.image,
        detail: "Image file is missing from public/",
      });
    } else {
      const studio = await isStudioWhiteBackground(abs);
      if (!studio.ok) {
        issues.push({
          severity: "error",
          code: "studio-background",
          slug: p.slug,
          name: p.name,
          image: p.image,
          detail: studio.square
            ? `Photo is not a white studio mockup (white border ${(studio.whiteBorder * 100).toFixed(0)}%, dark border ${(studio.darkBorder * 100).toFixed(0)}%). Ghost mannequin on white only — no lifestyle walls or props.`
            : "Photo must be square (1:1). A 3:2 landscape shot sits as a dark band in the product grid.",
        });
      }
    }

    const list = byImage.get(p.image) ?? [];
    list.push(p);
    byImage.set(p.image, list);

    const obj = productObject(p);
    const imgKind = imageKindHint(p.image);
    if (STRICT_OBJECTS.has(obj) && imgKind) {
      const ok = (OBJECT_OK[obj] ?? [obj]).includes(imgKind);
      if (!ok) {
        issues.push({
          severity: "error",
          code: "kind-mismatch",
          slug: p.slug,
          name: p.name,
          image: p.image,
          detail: `Title is a ${obj}, photo filename looks like a ${imgKind}`,
        });
      }
    }
    if (photoKindMismatch(p)) {
      issues.push({
        severity: "error",
        code: "kind-mismatch",
        slug: p.slug,
        name: p.name,
        image: p.image,
        detail: `Listing is a ${expectedPhotoKind(p)}, photo filename looks like a ${filenamePhotoKind(path.basename(p.image, path.extname(p.image)))}`,
      });
    }
  }

  for (const [image, group] of byImage) {
    const families = new Set(group.map(designFamily));
    if (families.size > 1) {
      for (const p of group) {
        issues.push({
          severity: "error",
          code: "slogan-collision",
          slug: p.slug,
          name: p.name,
          image,
          detail: `Same photo used by different designs: ${[...families].join(", ")}`,
        });
      }
    }
  }

  return issues.sort((a, b) => a.slug.localeCompare(b.slug));
}
