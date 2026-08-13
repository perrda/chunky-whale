export type ProductCategory =
  | "tees"
  | "longsleeves"
  | "hoodies"
  | "hats"
  | "home"
  | "bags"
  | "accessories";

export type SizeOption = { id: string; label: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  editionId: string;
  priceGbp: number;
  category: ProductCategory;
  tag: string;
  description: string;
  details: string[];
  image: string;
  print?: string;
  sizes?: SizeOption[];
  limited?: boolean;
  remaining?: number;
  featured?: boolean;
  event?: boolean;
  printful?: { variantId?: number; productId?: number };
  shopifyHandle?: string;
};

export const APPAREL_SIZES: SizeOption[] = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "2XL" },
];

export const HAT_SIZES: SizeOption[] = [{ id: "os", label: "One size" }];

const TEE = [
  "180–220gsm cotton (mid-weight, event-ready)",
  "Printed on demand in UK / US / EU / Asia hubs",
  "Unisex cut unless noted",
];
const HOOD = ["Mid-weight fleece", "Kangaroo pocket", "Printed on demand"];
const HAT = ["Adjustable", "Embroidered or printed mark", "Ships from nearest hub"];

export const collections = [
  { slug: "tees", label: "T-Shirts", blurb: "The daily uniform." },
  { slug: "longsleeves", label: "Long sleeves", blurb: "Conference weather." },
  { slug: "hoodies", label: "Hoodies & crew", blurb: "Heavier cloth." },
  { slug: "hats", label: "Hats", blurb: "Dad hats, 5-panels, buckets." },
  { slug: "home", label: "Home", blurb: "Mugs, candle, throw, print." },
  { slug: "bags", label: "Bags", blurb: "Totes and a pack." },
  { slug: "accessories", label: "Marks", blurb: "Stickers and pins." },
  { slug: "events", label: "Event capsules", blurb: "City drops." },
] as const;

export const products: Product[] = [
  {
    slug: "genesis-tee",
    name: "Genesis Tee",
    shortName: "Genesis",
    editionId: "OF-GEN-001",
    priceGbp: 32,
    category: "tees",
    tag: "House",
    featured: true,
    description: "Small ember seal at the chest, forged hash-geometry on the back. The first mark of the house.",
    details: TEE,
    image: "/products/genesis-tee.png",
    print: "/prints/print-genesis.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "block-height-tee",
    name: "Block Height Tee",
    shortName: "Block Height",
    editionId: "OF-BLK-001",
    priceGbp: 28,
    category: "tees",
    tag: "Core",
    featured: true,
    description: "Stacked bone numerals — a height, not a slogan. Wear the clock that does not stop.",
    details: TEE,
    image: "/products/block-height-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "timechain-tee",
    name: "Timechain Tee",
    shortName: "Timechain",
    editionId: "OF-TCH-001",
    priceGbp: 28,
    category: "tees",
    tag: "Core",
    description: "Linked incomplete rings across the chest. Quiet sequence. No shout.",
    details: TEE,
    image: "/products/timechain-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "fixed-supply-tee",
    name: "Fixed Supply Tee",
    shortName: "Fixed Supply",
    editionId: "OF-FIX-001",
    priceGbp: 28,
    category: "tees",
    tag: "Core",
    description: "Bone cloth, ember seal, twenty-one ticks on the back fold. The number is the design.",
    details: TEE,
    image: "/products/fixed-supply-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "mempool-tee",
    name: "Mempool Tee",
    shortName: "Mempool",
    editionId: "OF-MEM-001",
    priceGbp: 28,
    category: "tees",
    tag: "Core",
    description: "A field of waiting marks. One ember rectangle is included. The rest wait.",
    details: TEE,
    image: "/products/mempool-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "seal-tee",
    name: "Ember Seal Tee",
    shortName: "Seal",
    editionId: "OF-SEL-001",
    priceGbp: 30,
    category: "tees",
    tag: "House",
    featured: true,
    description: "Macro wax-seal on the back. Almost nothing on the chest. The house stamp, large.",
    details: TEE,
    image: "/products/seal-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "tailored-tee",
    name: "Ring Tailored Tee",
    shortName: "Tailored",
    editionId: "OF-TLR-001",
    priceGbp: 30,
    category: "tees",
    tag: "Fit",
    description: "Slightly tailored through the body. Gold incomplete ring at the chest. Same mark, closer cut.",
    details: [...TEE, "Closer shoulder than the boxy house tee"],
    image: "/products/tailored-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hash-tank",
    name: "Hash Tank",
    shortName: "Tank",
    editionId: "OF-TNK-001",
    priceGbp: 26,
    category: "tees",
    tag: "Athletic",
    description: "Dry-hand tank. Ember seal at the hem, hash ticks on the side seam. Floor heat, not a gym slogan.",
    details: ["Athletic jersey", "Side-seam ticks", "Printed on demand"],
    image: "/products/hash-tank.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "mena-2026-tee",
    name: "MENA 2026 Capsule Tee",
    shortName: "MENA Capsule",
    editionId: "OF-MENA-2026",
    priceGbp: 36,
    category: "tees",
    tag: "Abu Dhabi",
    limited: true,
    remaining: 210,
    event: true,
    featured: true,
    description: "Latin and Arabic atelier mark. Numbered for Bitcoin MENA, Abu Dhabi.",
    details: [...TEE, "Numbered hang-tag OF-MENA-2026"],
    image: "/products/mena-tee.png",
    print: "/prints/print-mena.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "amsterdam-tee",
    name: "Amsterdam 2026 Tee",
    shortName: "Amsterdam",
    editionId: "OF-AMS-2026",
    priceGbp: 34,
    category: "tees",
    tag: "Amsterdam",
    event: true,
    description: "Canal-line geometry. Dress-rehearsal drop for Bitcoin Amsterdam, 5–6 Nov 2026.",
    details: TEE,
    image: "/products/amsterdam-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "prague-tee",
    name: "Prague 2027 Tee",
    shortName: "Prague",
    editionId: "OF-PRG-2027",
    priceGbp: 34,
    category: "tees",
    tag: "Prague",
    event: true,
    description: "Arch geometry for BTC Prague. Wear it in May 2027 — or before, as a claim.",
    details: TEE,
    image: "/products/prague-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "nashville-tee",
    name: "Nashville 2027 Tee",
    shortName: "Nashville",
    editionId: "OF-NSH-2027",
    priceGbp: 34,
    category: "tees",
    tag: "Nashville",
    event: true,
    description: "Hall-arch line for Bitcoin 2027. The US flagship floor.",
    details: TEE,
    image: "/products/nashville-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "ember-longsleeve",
    name: "Ember Long Sleeve",
    shortName: "Ember LS",
    editionId: "OF-ELS-001",
    priceGbp: 34,
    category: "longsleeves",
    tag: "Core",
    featured: true,
    description: "Seal at the chest. Gold hash ticks down both sleeves. Built for halls that run cold.",
    details: ["Long sleeve jersey", "Sleeve ticks", "Printed on demand"],
    image: "/products/ember-longsleeve.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "difficulty-hoodie",
    name: "Difficulty Hoodie",
    shortName: "Difficulty",
    editionId: "OF-DIF-001",
    priceGbp: 55,
    category: "hoodies",
    tag: "House",
    featured: true,
    description: "Hash lattice across the chest. The visual of work that does not get easier.",
    details: [...HOOD, "Hash-geometry chest print"],
    image: "/products/difficulty-hoodie.png",
    print: "/prints/print-difficulty.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "ember-hoodie",
    name: "Ember Hoodie",
    shortName: "Ember Hoodie",
    editionId: "OF-EHD-001",
    priceGbp: 52,
    category: "hoodies",
    tag: "Core",
    description: "Quiet wordmark, ember seal. The hoodie you actually pack.",
    details: HOOD,
    image: "/products/ember-hoodie.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "zip-hoodie",
    name: "Lattice Zip Hoodie",
    shortName: "Zip",
    editionId: "OF-ZIP-001",
    priceGbp: 58,
    category: "hoodies",
    tag: "Core",
    description: "Zip front. Lattice lives on the back so the chest stays clean.",
    details: [...HOOD, "Full zip"],
    image: "/products/zip-hoodie.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "ring-crewneck",
    name: "Ring Crewneck",
    shortName: "Crew",
    editionId: "OF-CRW-001",
    priceGbp: 48,
    category: "hoodies",
    tag: "Core",
    description: "Gold incomplete-ring embroidery. No hood. Conference layer.",
    details: ["Crew fleece", "Chest embroidery", "Printed / stitched on demand"],
    image: "/products/ring-crewneck.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hash-cap",
    name: "Hash Cap",
    shortName: "Hash Cap",
    editionId: "OF-HSH-001",
    priceGbp: 28,
    category: "hats",
    tag: "House",
    featured: true,
    description: "Structured 5-panel. Gold incomplete-ring. Conference light.",
    details: HAT,
    image: "/products/hash-cap.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "ember-dad-hat",
    name: "Ember Dad Hat",
    shortName: "Dad Hat",
    editionId: "OF-EMB-001",
    priceGbp: 24,
    category: "hats",
    tag: "Core",
    description: "Low profile. Tiny gold seal. The hat that does not try.",
    details: HAT,
    image: "/products/ember-dad-hat.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "desert-bucket",
    name: "Desert Bucket",
    shortName: "Bucket",
    editionId: "OF-BKT-001",
    priceGbp: 26,
    category: "hats",
    tag: "Core",
    description: "Reversible bucket. Gold ring one side, ember under-brim.",
    details: HAT,
    image: "/products/desert-bucket.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "forge-beanie",
    name: "Forge Beanie",
    shortName: "Beanie",
    editionId: "OF-BNE-001",
    priceGbp: 22,
    category: "hats",
    tag: "Core",
    description: "Cuff seal in gold. Prague, Amsterdam, Nashville winters.",
    details: HAT,
    image: "/products/forge-beanie.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "trucker-cap",
    name: "Ring Trucker",
    shortName: "Trucker",
    editionId: "OF-TRK-001",
    priceGbp: 26,
    category: "hats",
    tag: "Core",
    description: "Bone mesh, black front, gold ring. Floor hat.",
    details: HAT,
    image: "/products/trucker-cap.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "foundry-mug",
    name: "Foundry Mug",
    shortName: "Foundry Mug",
    editionId: "OF-MUG-001",
    priceGbp: 16,
    category: "home",
    tag: "House",
    featured: true,
    description: "Bone ceramic, hash ring, ember near the handle.",
    details: ["11oz ceramic", "Dishwasher safe", "Nearest print hub"],
    image: "/products/foundry-mug.png",
  },
  {
    slug: "ink-mug",
    name: "Ink Mug",
    shortName: "Ink Mug",
    editionId: "OF-MUG-002",
    priceGbp: 16,
    category: "home",
    tag: "Core",
    description: "Matte black. Gold ticks. The other morning.",
    details: ["11oz ceramic", "Dishwasher safe"],
    image: "/products/ink-mug.png",
  },
  {
    slug: "foundry-candle",
    name: "Foundry Candle",
    shortName: "Candle",
    editionId: "OF-CND-001",
    priceGbp: 22,
    category: "home",
    tag: "Core",
    description: "Amber glass, bone label, ember seal. Burn it while a block lands.",
    details: ["Soy blend", "Tin and glass", "Print-on-demand partner"],
    image: "/products/foundry-candle.png",
  },
  {
    slug: "hash-throw",
    name: "Hash Throw",
    shortName: "Throw",
    editionId: "OF-THR-001",
    priceGbp: 55,
    category: "home",
    tag: "Core",
    featured: true,
    description: "Charcoal throw, woven seal in the corner. The one home piece that earns the suitcase.",
    details: ["Woven throw", "Corner seal", "Ships folded"],
    image: "/products/hash-throw.png",
  },
  {
    slug: "hash-poster",
    name: "Lattice Print",
    shortName: "Print",
    editionId: "OF-PST-001",
    priceGbp: 28,
    category: "home",
    tag: "Core",
    description: "Forged hash-geometry on bone stock. Frame not included.",
    details: ["Giclée on demand", "Ships rolled or flat by region"],
    image: "/products/hash-poster.png",
    print: "/prints/print-genesis.png",
  },
  {
    slug: "coaster-set",
    name: "Hash Coasters",
    shortName: "Coasters",
    editionId: "OF-CST-001",
    priceGbp: 18,
    category: "home",
    tag: "Core",
    description: "Four ceramic stamps. Four geometries. One table.",
    details: ["Set of four", "Cork back where the printer allows"],
    image: "/products/coaster-set.png",
  },
  {
    slug: "forge-tote",
    name: "Forge Tote",
    shortName: "Tote",
    editionId: "OF-TOT-001",
    priceGbp: 22,
    category: "bags",
    tag: "House",
    description: "Heavy canvas. Quiet wordmark. Booth bag and daily bag.",
    details: ["12oz canvas", "Reinforced handles"],
    image: "/products/forge-tote.png",
  },
  {
    slug: "forge-pack",
    name: "Forge Pack",
    shortName: "Pack",
    editionId: "OF-PCK-001",
    priceGbp: 32,
    category: "bags",
    tag: "Core",
    description: "Canvas pack, ember seal. Laptop-ish, conference-ish.",
    details: ["Canvas backpack", "Printed on demand"],
    image: "/products/forge-pack.png",
  },
  {
    slug: "sticker-pack",
    name: "Sticker Pack",
    shortName: "Stickers",
    editionId: "OF-STK-001",
    priceGbp: 8,
    category: "accessories",
    tag: "House",
    description: "Six die-cuts: seal, ring, hash, bilingual mark, desert line, OF.",
    details: ["Vinyl", "Weatherproof"],
    image: "/products/sticker-pack.png",
  },
  {
    slug: "pin-set",
    name: "Seal Pin Set",
    shortName: "Pins",
    editionId: "OF-PIN-001",
    priceGbp: 14,
    category: "accessories",
    tag: "Core",
    description: "Three enamel marks: ember seal, incomplete ring, OF monogram.",
    details: ["Enamel on card", "Locking backs"],
    image: "/products/pin-set.png",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsIn(slug: string) {
  if (slug === "events") return products.filter((p) => p.event);
  return products.filter((p) => p.category === slug);
}

export function searchProducts(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(n) ||
      p.tag.toLowerCase().includes(n) ||
      p.editionId.toLowerCase().includes(n) ||
      p.description.toLowerCase().includes(n) ||
      p.category.includes(n),
  );
}

export function relatedProducts(slug: string, limit = 4) {
  const p = getProduct(slug);
  if (!p) return products.slice(0, limit);
  return products.filter((x) => x.slug !== slug && (x.category === p.category || x.event === p.event)).slice(0, limit);
}

export function formatGbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export const SIZE_CHART = {
  tees: [
    { size: "S", chest: "96–101", length: "70" },
    { size: "M", chest: "101–106", length: "72" },
    { size: "L", chest: "106–111", length: "74" },
    { size: "XL", chest: "111–116", length: "76" },
    { size: "2XL", chest: "116–121", length: "78" },
  ],
  hoodies: [
    { size: "S", chest: "108–114", length: "68" },
    { size: "M", chest: "114–120", length: "70" },
    { size: "L", chest: "120–126", length: "72" },
    { size: "XL", chest: "126–132", length: "74" },
    { size: "2XL", chest: "132–138", length: "76" },
  ],
};
