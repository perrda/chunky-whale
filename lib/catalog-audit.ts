/** Server / QA only. Do not import from client components — uses fs/sharp. */
import { existsSync } from "fs";
import path from "path";
import { largestOrangeMarkTilt, officialMarkLooksLocked } from "./catalog-bitcoin-mark";
import { auditColorMatch } from "./catalog-color";
import { studioGrainScore } from "./catalog-grain";
import { expectedPhotoKind, filenamePhotoKind, photoKindMismatch } from "./catalog-kind";
import { isStudioWhiteBackground } from "./catalog-studio";
import { lineKey } from "./design-line";
import { auditPrintSources } from "./catalog-print-allowlist";
import { auditPrintClarity } from "./catalog-print-clarity";
import { products as allProducts, RETIRED_SLUGS, type Product } from "./products";

export { expectedPhotoKind, filenamePhotoKind, photoKindMismatch } from "./catalog-kind";
export { lineKey as designFamily } from "./design-line";

function imageKindHint(image: string): string | null {
  const base = path.basename(image, path.extname(image)).toLowerCase();
  return filenamePhotoKind(base);
}

function productObject(product: Product): string {
  const slug = product.slug.toLowerCase();
  if (slug.includes("tumbler")) return "tumbler";
  if (slug.includes("whiskey") || slug.includes("whisky")) return "whiskey";
  if (slug.includes("shot")) return "shot";
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
  "whiskey",
  "shot",
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
  whiskey: ["whiskey"],
  shot: ["shot"],
  pint: ["pint"],
  coaster: ["coaster"],
  tote: ["tote"],
  pack: ["pack"],
  pendant: ["pendant"],
  bracelet: ["bracelet"],
};

export type CatalogImageIssue = {
  severity: "error" | "warning";
  code: "missing-file" | "slogan-collision" | "kind-mismatch" | "studio-background" | "bitcoin-mark" | "color-match" | "grain" | "print-source" | "print-clarity";
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

  if (!officialMarkLooksLocked()) {
    issues.push({
      severity: "error",
      code: "bitcoin-mark",
      slug: "brand",
      name: "Official Bitcoin mark",
      image: "/brand/bitcoin-coin.svg",
      detail: "Official bitboy ₿ files are missing or were rewritten. Restore public/brand/bitcoin-b.svg and bitcoin-coin.svg.",
    });
  }

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
      const grain = await studioGrainScore(abs);
      if (grain.grainy) {
        issues.push({
          severity: "error",
          code: "grain",
          slug: p.slug,
          name: p.name,
          image: p.image,
          detail: `Studio backdrop is grainy (score ${grain.grain.toFixed(1)}). Catalog photos must be clean white, not speckled.`,
        });
      }
      const skipMark = ["pendant", "bracelet", "mug", "tote", "tumbler", "pint", "coaster", "whiskey", "shot"].includes(
        productObject(p),
      );
      const markImages = skipMark
        ? []
        : [p.image, ...Object.values(p.imagesByColor ?? {})].filter((v, i, a) => a.indexOf(v) === i);
      for (const image of markImages) {
        const markAbs = path.join(publicDir, image.replace(/^\//, ""));
        if (!existsSync(markAbs)) continue;
        const mark = await largestOrangeMarkTilt(markAbs);
        const mustLean = /bitcoin-daddy|bitcoin-mummy|b-mark-hoodie|btc-b-tee/.test(p.slug);
        if (mark.found && !mark.clockwise && (mark.primary || mustLean)) {
          issues.push({
            severity: "error",
            code: "bitcoin-mark",
            slug: p.slug,
            name: p.name,
            image,
            detail:
              mark.lean === "ccw"
                ? `Bitcoin mark leans left / counter-clockwise. Official bitboy ₿ leans ~14° right (clockwise), #F7931A.`
                : `Bitcoin mark is upright (${mark.tilt.toFixed(1)}° off vertical). Use the official bitboy ₿ — ~14° clockwise, #F7931A. Never a vertical B.`,
          });
        }
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
    const families = new Set(group.map(lineKey));
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

  const colorIssues = await auditColorMatch(products, publicDir);
  for (const c of colorIssues) {
    issues.push({
      severity: "error",
      code: "color-match",
      slug: c.slug,
      name: c.name,
      image: c.image,
      detail: c.detail,
    });
  }

  for (const p of auditPrintSources(products)) {
    issues.push({
      severity: "error",
      code: "print-source",
      slug: p.slug,
      name: p.name,
      image: p.image,
      detail: p.detail,
    });
  }

  for (const p of await auditPrintClarity(products, publicDir)) {
    issues.push({
      severity: "error",
      code: "print-clarity",
      slug: p.slug,
      name: p.name,
      image: p.image,
      detail: p.detail,
    });
  }

  return issues.sort((a, b) => a.slug.localeCompare(b.slug));
}
