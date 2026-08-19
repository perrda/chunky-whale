import path from "path";
import type { Product } from "./products";

/** What the photo file looks like. Null = cannot tell from the name. */
export function filenamePhotoKind(base: string): string | null {
  const b = base.toLowerCase();
  if (/(board-shorts|swim-shorts|youth-swim|toddler-swim|bikini|one-piece|rash-guard|swim-cap|rash|swim)/.test(b))
    return "swim";
  if (
    /(dad-hat|trucker-hat|bucket-hat|flexfit-hat|vintage-hat|distressed-hat|snapback|beanie|trucker|bucket|flexfit)$/.test(b) ||
    /(?:^|-)hat$/.test(b) ||
    /(?:^|-)cap$/.test(b)
  )
    return "hat";
  if (/(hoodie|pullover|crew|zip)$/.test(b) || b.includes("-hoodie") || b.includes("-pullover")) return "hoodie";
  if (b.includes("longsleeve")) return "longsleeve";
  if (b.includes("vneck")) return "vneck";
  if (b.includes("tank")) return "tank";
  if (b.includes("crop")) return "crop";
  if (/(mug)$/.test(b) || b.includes("-mug")) return "mug";
  if (b.includes("tumbler")) return "tumbler";
  if (b.includes("pint")) return "pint";
  if (b.includes("coaster")) return "coaster";
  if (b.includes("tote")) return "tote";
  if (b.includes("-pack") || /(?:^|-)pack$/.test(b)) return "pack";
  if (b.includes("pendant") || b.includes("necklace") || b.includes("bracelet")) return "jewelry";
  if (b.includes("onesie")) return "onesie";
  if (/(poster|print)$/.test(b) && !b.includes("cant-print")) return "poster";
  if (/(?:^|-)tee$/.test(b) || b.includes("-tee-")) return "tee";
  return null;
}

/** What the listing is selling. */
export function expectedPhotoKind(product: Product): string {
  const s = product.slug.toLowerCase();
  const k = (product.kind ?? "").toLowerCase();
  if (product.category === "swimwear") return "swim";
  if (product.category === "hats") return "hat";
  if (product.category === "hoodies") return "hoodie";
  if (product.category === "longsleeves" || s.includes("longsleeve")) return "longsleeve";
  if (k === "vneck" || s.includes("vneck")) return "vneck";
  if (k === "tank" || (s.includes("tank") && product.cut === "women")) return "tank";
  if (k === "crop" || s.includes("crop")) return "crop";
  if (k === "mug" || s.includes("mug")) return "mug";
  if (k === "tumbler" || s.includes("tumbler")) return "tumbler";
  if (k === "pint" || s.includes("pint")) return "pint";
  if (k === "coaster" || s.includes("coaster")) return "coaster";
  if (s.includes("tote") || (product.category === "bags" && !s.includes("pack"))) return "tote";
  if (s.includes("pack") && product.category === "bags") return "pack";
  if (product.category === "posters" || s.includes("poster") || /-(ps)$/.test(s)) return "poster";
  if (product.category === "jewelry") return "jewelry";
  if (product.cut === "infant" || s.includes("onesie")) return "onesie";
  if (product.category === "tees") return "tee";
  return product.category;
}

const KIND_OK: Record<string, string[]> = {
  tee: ["tee", "onesie"],
  onesie: ["onesie", "tee"],
  hoodie: ["hoodie"],
  longsleeve: ["longsleeve"],
  vneck: ["vneck"],
  tank: ["tank"],
  crop: ["crop"],
  hat: ["hat"],
  swim: ["swim"],
  mug: ["mug"],
  tumbler: ["tumbler"],
  pint: ["pint"],
  coaster: ["coaster"],
  tote: ["tote"],
  pack: ["pack"],
  poster: ["poster"],
  jewelry: ["jewelry"],
};

/** True when the listing is a hat/hoodie/etc but the photo file is clearly another object (usually a tee). */
export function photoKindMismatch(product: Product): boolean {
  const file = filenamePhotoKind(path.basename(product.image, path.extname(product.image)));
  if (!file) return false;
  const expect = expectedPhotoKind(product);
  const ok = KIND_OK[expect] ?? [expect];
  return !ok.includes(file);
}
