import { CLOTHING_COLORS } from "./drop-07";
import type { Product } from "./products";

const APPAREL = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "2XL" },
  { id: "3xl", label: "3XL" },
  { id: "4xl", label: "4XL" },
];

const POLO_DETAILS = [
  "Pique polo. Collar and placket.",
  "Stitched official ₿ — no slogan, nothing flashy",
  "12 garment colours. Mid-price.",
];

function polo(slug: string, name: string, short: string, image: string, desc: string, featured?: boolean): Product {
  return {
    slug,
    name,
    shortName: short,
    editionId: `SH-D13-${slug.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    priceGbp: 42,
    category: "tees",
    tag: "Premium",
    kind: "polo",
    finish: "embroidery",
    featured,
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: desc,
    details: POLO_DETAILS,
    image,
    sizes: APPAREL,
  };
}

export const drop13Polos: Product[] = [
  polo(
    "polo-crest",
    "Stitched ₿ Polo",
    "Crest Polo",
    "/products/polo-crest.png",
    "Left-chest stitched official ₿. Formal enough for a dinner. Nothing flashy.",
    true,
  ),
  polo(
    "polo-center",
    "Center ₿ Polo",
    "Center Polo",
    "/products/polo-center.png",
    "One stitched ₿ on the chest. Still quiet. Still orange.",
  ),
  polo(
    "polo-mini",
    "Mini ₿ Polo",
    "Mini Polo",
    "/products/polo-mini.png",
    "The smallest stitched ₿. If you know, you know.",
  ),
  {
    slug: "quiet-b-tee",
    name: "Quiet ₿ Tee",
    shortName: "Quiet ₿",
    editionId: "SH-D13-QUIETB-T",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    featured: true,
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: "Just the official ₿. No joke on the chest. The quiet flex.",
    details: ["180–220gsm cotton", "Official ₿ only", "12 garment colours"],
    image: "/products/quiet-b-tee.png",
    sizes: APPAREL,
  },
  {
    slug: "crest-b-tee",
    name: "Crest ₿ Tee",
    shortName: "Crest ₿",
    editionId: "SH-D13-CRESTB-T",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: "Small official ₿, left chest. Tee cut, polo energy.",
    details: ["180–220gsm cotton", "Left-chest ₿", "12 garment colours"],
    image: "/products/crest-b-tee.png",
    sizes: APPAREL,
  },
];
