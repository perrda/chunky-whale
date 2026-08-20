import { photoKindMismatch } from "./catalog-kind";
import { drop05 } from "./drop-05";
import { drop06 } from "./drop-06";
import { CLOTHING_COLORS, drop07 } from "./drop-07";
import { drop08Swim } from "./drop-08-swim";
import { drop09Parents } from "./drop-09-parents";
import { drop10Sweats } from "./drop-10-sweats";
import { drop11Glasses } from "./drop-11-glasses";

export { CLOTHING_COLORS };

export type ProductCategory =
  | "tees"
  | "longsleeves"
  | "hoodies"
  | "hats"
  | "home"
  | "bags"
  | "accessories"
  | "drinkware"
  | "posters"
  | "jewelry"
  | "swimwear";

export type Cut = "unisex" | "women" | "youth" | "toddler" | "infant";

export type SizeOption = { id: string; label: string };
export type ColorOption = { id: string; label: string; hex: string };

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
  imagesByColor?: Record<string, string>;
  print?: string;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  cut?: Cut;
  kind?: string;
  trending?: boolean;
  finish?: "print" | "embroidery";
  limited?: boolean;
  remaining?: number;
  featured?: boolean;
  /** Units sold. When live orders exist, the homepage hero prefers these. */
  soldCount?: number;
  event?: boolean;
  retired?: boolean;
  printful?: {
    variantId?: number;
    productId?: number;
    /** Size:colour → Printful variant. Example key: `m:navy`. */
    variants?: Record<string, number>;
  };
  shopifyHandle?: string;
};

export const HOUSE_COLORS: ColorOption[] = [
  { id: "ink", label: "Ink", hex: "#0B0C0E" },
  { id: "bone", label: "Bone", hex: "#EDE6D9" },
  { id: "btc", label: "Bitcoin orange", hex: "#F7931A" },
  { id: "navy", label: "Navy", hex: "#1B2430" },
  { id: "heather", label: "Heather", hex: "#6B6E73" },
];

export const TEE_COLORS: ColorOption[] = [
  { id: "heather-light", label: "Light heather", hex: "#C8C9CB" },
  { id: "charcoal", label: "Charcoal", hex: "#3A3D42" },
  { id: "navy", label: "Navy", hex: "#1B2430" },
  { id: "ink", label: "Ink", hex: "#0B0C0E" },
  { id: "btc", label: "Bitcoin orange", hex: "#F7931A" },
  { id: "bone", label: "Bone", hex: "#EDE6D9" },
];

export const APPAREL_SIZES: SizeOption[] = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "2XL" },
  { id: "3xl", label: "3XL" },
  { id: "4xl", label: "4XL" },
];

export const WOMEN_SIZES: SizeOption[] = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "2XL" },
];

export const YOUTH_SIZES: SizeOption[] = [
  { id: "ys", label: "Youth S" },
  { id: "ym", label: "Youth M" },
  { id: "yl", label: "Youth L" },
];

export const TODDLER_SIZES: SizeOption[] = [
  { id: "2t", label: "2T" },
  { id: "3t", label: "3T" },
  { id: "4t", label: "4T" },
  { id: "5t", label: "5T" },
];

export const INFANT_SIZES: SizeOption[] = [
  { id: "3m", label: "0–3M" },
  { id: "6m", label: "3–6M" },
  { id: "12m", label: "6–12M" },
  { id: "18m", label: "12–18M" },
  { id: "24m", label: "18–24M" },
];

export const HAT_SIZES: SizeOption[] = [{ id: "os", label: "One size" }];

export const TEE = [
  "180–220gsm cotton (mid-weight, event-ready)",
  "Printed on demand in UK / US / EU / Asia hubs",
  "Unisex cut unless noted",
];
export const HOOD = ["Mid-weight fleece", "Kangaroo pocket", "Printed on demand"];
export const HAT = ["Adjustable", "Embroidered or printed mark", "Ships from nearest hub"];
export const EMB = ["Raised embroidery (not a cheap DTG print)", "Printful stitch · 2–5 day fulfil", "Premium mid-price"];

export const collections = [
  { slug: "memes", label: "Memes", blurb: "The lines Bitcoiners already shout." },
  { slug: "tees", label: "T-Shirts", blurb: "₿ on the chest. Wear it." },
  { slug: "hoodies", label: "Sweatshirts", blurb: "Hoodies, pullovers, crew, zip. Same jokes, heavier cloth." },
  { slug: "women", label: "Women", blurb: "V-neck, tank, same ₿." },
  { slug: "hats", label: "Hats", blurb: "Dad hats, buckets, beanies. Stitched ₿." },
  { slug: "kids", label: "Kids", blurb: "Youth, toddler, infant." },
  { slug: "swimwear", label: "Swimwear", blurb: "Shorts, bikinis, caps. Same ₿." },
  { slug: "drinkware", label: "Drinkware", blurb: "Mugs, whiskey, shots, tumblers, pints." },
  { slug: "jewelry", label: "Jewelry", blurb: "Pendants, necklaces, bracelets." },
  { slug: "posters", label: "Posters", blurb: "Charts, 21 million, the paper." },
  { slug: "premium", label: "Premium", blurb: "Stitched logos. Caps, hoodies, tees." },
  { slug: "longsleeves", label: "Long sleeves", blurb: "Conference weather." },
  { slug: "bags", label: "Bags", blurb: "Totes and a pack." },
  { slug: "accessories", label: "Stickers & pins", blurb: "Laptop and lapel." },
  { slug: "mummy-daddy", label: "Mummy & Daddy", blurb: "Bitcoin Mummy. Bitcoin Daddy." },
] as const;

export const products: Product[] = [
  ...drop11Glasses,
  ...drop10Sweats,
  ...drop09Parents,
  ...drop08Swim,
  ...drop07,
  ...drop06,
  ...drop05,
  {
    slug: "hodl-tee",
    name: "I AM HODLING",
    shortName: "HODL",
    editionId: "HM-HODL-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: [
      { id: "charcoal", label: "Charcoal", hex: "#3A3D42" },
      { id: "navy", label: "Navy", hex: "#1B2430" },
      { id: "ink", label: "Ink", hex: "#0B0C0E" },
      { id: "btc", label: "Bitcoin orange", hex: "#F7931A" },
      { id: "bone", label: "Bone", hex: "#EDE6D9" },
    ],
    imagesByColor: {
      charcoal: "/products/hodl-tee.png",
      navy: "/products/hodl-tee-navy.png",
      ink: "/products/hodl-tee-ink.png",
      btc: "/products/hodl-tee-btc.png",
      bone: "/products/hodl-tee-bone.png",
    },
    description:
      "December 2013. A drunk typo on BitcoinTalk. The whole personality since. Orange ₿ on the chest.",
    details: TEE,
    image: "/products/hodl-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "stack-sats-tee",
    name: "STACK SATS",
    shortName: "Stack Sats",
    editionId: "HM-SAT-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Small units. Long game. Orange ₿. The daily ritual, printed.",
    details: TEE,
    image: "/products/stack-sats-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "few-understand-tee",
    name: "FEW UNDERSTAND",
    shortName: "Few",
    editionId: "HM-FEW-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "The in-joke. No explainer. If they ask, they are not the few.",
    details: TEE,
    image: "/products/few-understand-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "fixes-this-tee",
    name: "BITCOIN FIXES THIS",
    shortName: "Fixes This",
    editionId: "HM-FIX-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Reply-guy energy, wearable. Orange ₿. Apply to almost anything.",
    details: TEE,
    image: "/products/fixes-this-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "one-btc-tee",
    name: "1 BTC = 1 BTC",
    shortName: "1 BTC",
    editionId: "HM-1BTC-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "The tautology that ends the thread. Unit of account, not a dollar chart.",
    details: TEE,
    image: "/products/one-btc-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "21-million-tee",
    name: "21 MILLION",
    shortName: "21M",
    editionId: "HM-21M-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "The cap. The joke. The whole monetary policy on a tee. Orange ₿.",
    details: TEE,
    image: "/products/21-million-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "verify-meme-tee",
    name: "DON'T TRUST. VERIFY.",
    shortName: "Verify",
    editionId: "HM-VFY-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Cypherpunk rule one. Not a mood. Run the numbers yourself.",
    details: TEE,
    image: "/products/verify-meme-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "no-second-tee",
    name: "THERE IS NO SECOND BEST",
    shortName: "No Second",
    editionId: "HM-NSB-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Maxi, but make it merch. One network. One ₿. No altcoin cameo.",
    details: TEE,
    image: "/products/no-second-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hard-money-tee",
    name: "HARD MONEY",
    shortName: "Hard Money",
    editionId: "HM-HM-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "House mark. Big orange ₿, HARD MONEY across the chest. The name, worn.",
    details: TEE,
    image: "/products/hard-money-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "satoshi-tee",
    name: "SATOSHI WAS HERE",
    shortName: "Satoshi",
    editionId: "HM-SATOSHI-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "The signature that never came. Orange ₿. A ghost in the protocol.",
    details: TEE,
    image: "/products/satoshi-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "whitepaper-tee",
    name: "PEER-TO-PEER ELECTRONIC CASH",
    shortName: "White Paper",
    editionId: "HM-WP-001",
    priceGbp: 30,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "The title. 31 October 2008. Wear the paper, not a think-piece.",
    details: TEE,
    image: "/products/whitepaper-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "gradually-tee",
    name: "GRADUALLY, THEN SUDDENLY",
    shortName: "Gradually",
    editionId: "HM-GTS-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    featured: true,
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Hemingway, borrowed by Bitcoin. How the old money dies.",
    details: TEE,
    image: "/products/gradually-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "nyknyc-tee",
    name: "NOT YOUR KEYS NOT YOUR COINS",
    shortName: "NYKNYC",
    editionId: "HM-NYK-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Self-custody as a stacked headline. Gift it to the cousin still on an exchange.",
    details: TEE,
    image: "/products/nyknyc-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "finite-tee",
    name: "INFINITE FIAT / FINITE BITCOIN",
    shortName: "Finite",
    editionId: "HM-FIN-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Two lines. The whole argument. They can print theirs. We cannot print this.",
    details: TEE,
    image: "/products/finite-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "run-node-tee",
    name: "RUN YOUR NODE",
    shortName: "Run Node",
    editionId: "HM-NODE-001",
    priceGbp: 28,
    category: "tees",
    tag: "Meme",
    cut: "unisex",
    colors: TEE_COLORS,
    description: "Don't trust. Verify. Then actually run the software. Orange ₿.",
    details: TEE,
    image: "/products/run-node-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "ngu-tee",
    name: "NUMBER GO UP",
    shortName: "NGU",
    editionId: "HM-NGU-001",
    priceGbp: 30,
    category: "tees",
    tag: "Meme",
    cut: "unisex",
    colors: TEE_COLORS,
    description: "A rising line ending in ₿. The chart as humour — not a broker screenshot.",
    details: TEE,
    image: "/products/ngu-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hodl-hoodie",
    name: "HODL Hoodie",
    shortName: "HODL Hoodie",
    editionId: "HM-HODL-H",
    priceGbp: 55,
    category: "hoodies",
    tag: "Meme",
    kind: "hoodie",
    featured: true,
    cut: "unisex",
    colors: [
      { id: "ink", label: "Ink", hex: "#0B0C0E" },
      { id: "navy", label: "Navy", hex: "#1B2430" },
    ],
    imagesByColor: {
      ink: "/products/hodl-hoodie.png",
      navy: "/products/hodl-hoodie-navy.png",
    },
    description: "Orange ₿, HODL underneath. Conference layer for people who do not sell.",
    details: HOOD,
    image: "/products/hodl-hoodie.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hard-money-hat",
    name: "HARD MONEY Dad Hat",
    shortName: "HM Hat",
    editionId: "HM-HAT-001",
    priceGbp: 24,
    category: "hats",
    tag: "₿",
    featured: true,
    colors: HOUSE_COLORS,
    description: "Embroidered orange ₿. Navy first. The conference default.",
    details: HAT,
    image: "/products/hard-money-hat.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "genesis-tee",
    name: "Genesis Tee",
    shortName: "Genesis",
    editionId: "SH-GEN-001",
    priceGbp: 32,
    category: "tees",
    tag: "House",
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
    editionId: "SH-BLK-001",
    priceGbp: 28,
    category: "tees",
    tag: "Core",
    description: "Stacked bone numerals — a height, not a slogan. Wear the clock that does not stop.",
    details: TEE,
    image: "/products/block-height-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "timechain-tee",
    name: "Timechain Tee",
    shortName: "Timechain",
    editionId: "SH-TCH-001",
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
    editionId: "SH-FIX-001",
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
    editionId: "SH-MEM-001",
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
    editionId: "SH-SEL-001",
    priceGbp: 30,
    category: "tees",
    tag: "House",
    description: "Macro wax-seal on the back. Almost nothing on the chest. The house stamp, large.",
    details: TEE,
    image: "/products/seal-tee.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "tailored-tee",
    name: "Ring Tailored Tee",
    shortName: "Tailored",
    editionId: "SH-TLR-001",
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
    editionId: "SH-TNK-001",
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
    editionId: "SH-MENA-2026",
    priceGbp: 36,
    category: "tees",
    tag: "Abu Dhabi",
    limited: true,
    remaining: 210,
    event: true,
    featured: true,
    description: "Latin and Arabic atelier mark. Numbered for Bitcoin MENA, Abu Dhabi.",
    details: [...TEE, "Numbered hang-tag SH-MENA-2026"],
    image: "/products/mena-tee.png",
    print: "/prints/print-mena.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "amsterdam-tee",
    name: "Amsterdam 2026 Tee",
    shortName: "Amsterdam",
    editionId: "SH-AMS-2026",
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
    editionId: "SH-PRG-2027",
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
    editionId: "SH-NSH-2027",
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
    editionId: "SH-ELS-001",
    priceGbp: 34,
    category: "longsleeves",
    tag: "Core",
    description: "Seal at the chest. Gold hash ticks down both sleeves. Built for halls that run cold.",
    details: ["Long sleeve jersey", "Sleeve ticks", "Printed on demand"],
    image: "/products/ember-longsleeve.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "difficulty-hoodie",
    name: "Difficulty Hoodie",
    shortName: "Difficulty",
    editionId: "SH-DIF-001",
    priceGbp: 55,
    category: "hoodies",
    tag: "House",
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
    editionId: "SH-EHD-001",
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
    editionId: "SH-ZIP-001",
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
    editionId: "SH-CRW-001",
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
    editionId: "SH-HSH-001",
    priceGbp: 28,
    category: "hats",
    tag: "House",
    description: "Structured 5-panel. Gold incomplete-ring. Conference light.",
    details: HAT,
    image: "/products/hash-cap.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "ember-dad-hat",
    name: "Ember Dad Hat",
    shortName: "Dad Hat",
    editionId: "SH-EMB-001",
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
    editionId: "SH-BKT-001",
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
    editionId: "SH-BNE-001",
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
    editionId: "SH-TRK-001",
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
    editionId: "SH-MUG-001",
    priceGbp: 16,
    category: "home",
    tag: "House",
    description: "Bone ceramic, hash ring, ember near the handle.",
    details: ["11oz ceramic", "Dishwasher safe", "Nearest print hub"],
    image: "/products/foundry-mug.png",
  },
  {
    slug: "ink-mug",
    name: "Ink Mug",
    shortName: "Ink Mug",
    editionId: "SH-MUG-002",
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
    editionId: "SH-CND-001",
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
    editionId: "SH-THR-001",
    priceGbp: 55,
    category: "home",
    tag: "Core",
    description: "Charcoal throw, woven seal in the corner. The one home piece that earns the suitcase.",
    details: ["Woven throw", "Corner seal", "Ships folded"],
    image: "/products/hash-throw.png",
  },
  {
    slug: "hash-poster",
    name: "Lattice Print",
    shortName: "Print",
    editionId: "SH-PST-001",
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
    editionId: "SH-CST-001",
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
    editionId: "SH-TOT-001",
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
    editionId: "SH-PCK-001",
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
    editionId: "SH-STK-001",
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
    editionId: "SH-PIN-001",
    priceGbp: 14,
    category: "accessories",
    tag: "Core",
    description: "Three enamel marks: ember seal, incomplete ring, OF monogram.",
    details: ["Enamel on card", "Locking backs"],
    image: "/products/pin-set.png",
  },
  {
    slug: "btc-b-tee",
    name: "Bitcoin B Tee",
    shortName: "Bitcoin B",
    editionId: "SH-BTC-B",
    priceGbp: 28,
    category: "tees",
    tag: "₿",
    featured: true,
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "The mark. Classic Bitcoin B in orange. The one you gift without explaining.",
    details: [...TEE, "Unisex XS–4XL", "Ink / bone / orange / navy / heather"],
    image: "/products/btc-b-tee.png",
    print: "/prints/print-btc-b.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "log-scale-tee",
    name: "Log Scale Tee",
    shortName: "Log Scale",
    editionId: "SH-LOG-001",
    priceGbp: 30,
    category: "tees",
    tag: "Chart",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "The punchline is the axis. Rising log curve, ₿ at the last print. No Bloomberg chrome.",
    details: TEE,
    image: "/products/log-scale-tee.png",
    print: "/prints/print-log-scale.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "dip-feature-tee",
    name: "The Dip Is The Feature",
    shortName: "Dip Feature",
    editionId: "SH-DIP-001",
    priceGbp: 30,
    category: "tees",
    tag: "Chart",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "V-shaped recovery. Dry. The kind of joke that only lands if you've sat through one.",
    details: TEE,
    image: "/products/dip-feature-tee.png",
    print: "/prints/print-dip-feature.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "joke-21-tee",
    name: "21 Million. That's The Joke.",
    shortName: "21M Joke",
    editionId: "SH-21J-001",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "The supply cap, set as a one-liner. Small Bitcoin B underneath.",
    details: TEE,
    image: "/products/joke-21-tee.png",
    print: "/prints/print-21m-joke.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "keys-tee",
    name: "Not Your Keys Tee",
    shortName: "Keys",
    editionId: "SH-KEY-001",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "The sentence. Bone type, orange B. Gift it to the cousin still on an exchange.",
    details: TEE,
    image: "/products/keys-tee.png",
    print: "/prints/print-keys.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "orange-daily-tee",
    name: "Orange. Daily.",
    shortName: "Orange Daily",
    editionId: "SH-RX-001",
    priceGbp: 30,
    category: "tees",
    tag: "Family",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "Pharmacy-label gag. Amber bottle, ₿, 21M units. Funny to Bitcoiners, wearable at Sunday lunch.",
    details: TEE,
    image: "/products/orange-daily-tee.png",
    print: "/prints/print-orange-daily.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "candles-hoodie",
    name: "Candlestick Hoodie",
    shortName: "Candles",
    editionId: "SH-CNDL-H",
    priceGbp: 55,
    category: "hoodies",
    tag: "Chart",
    kind: "hoodie",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "White and orange candles as a textile. You stayed for the chart. Now you wear it.",
    details: HOOD,
    image: "/products/candles-hoodie-sq.png",
    print: "/prints/print-candles.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "stayed-chart-tee",
    name: "I Stayed For The Chart",
    shortName: "Stayed",
    editionId: "SH-CHT-001",
    priceGbp: 30,
    category: "tees",
    tag: "Chart",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "One rising line. One orange B. The whole personality.",
    details: TEE,
    image: "/products/log-scale-tee.png",
    print: "/prints/print-stayed-chart.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "ten-minutes-tee",
    name: "Ten Minutes Tee",
    shortName: "Ten Minutes",
    editionId: "SH-10M-001",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "Block interval as a clock. ₿ at the hub. For people who already know.",
    details: TEE,
    image: "/products/btc-b-tee.png",
    print: "/prints/print-ten-minutes.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "verify-tee",
    name: "Verify Tee",
    shortName: "Verify",
    editionId: "SH-VER-001",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "VERIFY. Don't trust, in a smaller voice. Orange ₿.",
    details: TEE,
    image: "/products/keys-tee.png",
    print: "/prints/print-verify.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "block-one-tee",
    name: "Since Block One",
    shortName: "Block One",
    editionId: "SH-B1-001",
    priceGbp: 28,
    category: "tees",
    tag: "Copy",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "Not a year. A block. Orange B above the line.",
    details: TEE,
    image: "/products/joke-21-tee.png",
    print: "/prints/print-block-one.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "hashrate-tee",
    name: "Hashrate Mountain Tee",
    shortName: "Hashrate",
    editionId: "SH-HR-001",
    priceGbp: 30,
    category: "tees",
    tag: "Chart",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "Hashrate as a quiet range. ₿ on the peak. Log scale in the corner.",
    details: TEE,
    image: "/products/log-scale-tee.png",
    print: "/prints/print-hashrate.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "difficulty-adjusts-tee",
    name: "Difficulty Adjusts Tee",
    shortName: "Difficulty Adjusts",
    editionId: "SH-DA-001",
    priceGbp: 30,
    category: "tees",
    tag: "Chart",
    cut: "unisex",
    colors: HOUSE_COLORS,
    description: "A staircase. The network does the work. You just wear the stairs.",
    details: TEE,
    image: "/products/dip-feature-tee.png",
    print: "/prints/print-difficulty-adjusts.png",
    sizes: APPAREL_SIZES,
  },
  {
    slug: "women-btc-tee",
    name: "Bitcoin B Tee — Women",
    shortName: "B Women",
    editionId: "SH-BTC-W",
    priceGbp: 28,
    category: "tees",
    tag: "Family",
    cut: "women",
    colors: HOUSE_COLORS,
    description: "Same orange B, closer cut. Gift without a different brand.",
    details: [...TEE, "Women's cut XS–2XL"],
    image: "/products/women-btc-tee.png",
    print: "/prints/print-btc-b.png",
    sizes: WOMEN_SIZES,
  },
  {
    slug: "youth-utxo-tee",
    name: "Future UTXO Youth Tee",
    shortName: "Youth UTXO",
    editionId: "SH-YTH-001",
    priceGbp: 22,
    category: "tees",
    tag: "Family",
    cut: "youth",
    colors: HOUSE_COLORS,
    description: "Orange B. Future UTXO. The insider joke, sized for a niece or nephew.",
    details: ["Youth S–L", "Same print hubs"],
    image: "/products/youth-utxo-tee.png",
    print: "/prints/print-youth-utxo.png",
    sizes: YOUTH_SIZES,
  },
  {
    slug: "toddler-btc-tee",
    name: "Bitcoin B Toddler Tee",
    shortName: "Toddler B",
    editionId: "SH-TOD-001",
    priceGbp: 18,
    category: "tees",
    tag: "Family",
    cut: "toddler",
    colors: HOUSE_COLORS,
    description: "Small B. 2T–5T. No sarcasm. Just the mark.",
    details: ["Toddler 2T–5T"],
    image: "/products/youth-utxo-tee.png",
    print: "/prints/print-btc-b.png",
    sizes: TODDLER_SIZES,
    retired: true,
  },
  {
    slug: "infant-node-onesie",
    name: "Node In Training Onesie",
    shortName: "Node Onesie",
    editionId: "SH-INF-001",
    priceGbp: 18,
    category: "tees",
    tag: "Family",
    cut: "infant",
    colors: [
      { id: "ink", label: "Ink", hex: "#0B0C0E" },
      { id: "bone", label: "Bone", hex: "#EDE6D9" },
    ],
    description: "Tiny ₿. Node in training. The family photo piece.",
    details: ["Infant 0–24 months", "Envelope neck"],
    image: "/products/infant-node-onesie.png",
    print: "/prints/print-infant-node.png",
    sizes: INFANT_SIZES,
  },
  {
    slug: "btc-dad-hat",
    name: "Bitcoin B Dad Hat",
    shortName: "B Hat",
    editionId: "SH-BTC-HAT",
    priceGbp: 24,
    category: "hats",
    tag: "₿",
    colors: HOUSE_COLORS,
    description: "Embroidered orange B. Navy, ink, or bone. The conference default.",
    details: HAT,
    image: "/products/btc-dad-hat.png",
    print: "/prints/print-btc-b.png",
    sizes: HAT_SIZES,
  },
  {
    slug: "log-chart-mug",
    name: "Log Chart Mug",
    shortName: "Log Mug",
    editionId: "SH-MUG-LOG",
    priceGbp: 16,
    category: "drinkware",
    kind: "mug",
    tag: "Chart",
    description: "The curve wraps the cup. Morning log scale.",
    details: ["11oz ceramic", "Dishwasher safe"],
    image: "/products/log-chart-mug.png",
    print: "/prints/print-log-scale.png",
  },
];

export const RETIRED_SLUGS = new Set([
  "genesis-tee",
  "block-height-tee",
  "timechain-tee",
  "fixed-supply-tee",
  "mempool-tee",
  "seal-tee",
  "tailored-tee",
  "hash-tank",
  "ember-longsleeve",
  "difficulty-hoodie",
  "ember-hoodie",
  "zip-hoodie",
  "ring-crewneck",
  "hash-cap",
  "ember-dad-hat",
  "desert-bucket",
  "forge-beanie",
  "trucker-cap",
  "foundry-mug",
  "ink-mug",
  "foundry-candle",
  "hash-throw",
  "hash-poster",
  "coaster-set",
  "forge-tote",
  "forge-pack",
  "sticker-pack",
  "pin-set",
  "amsterdam-tee",
  "prague-tee",
  "nashville-tee",
  "mena-2026-tee",
  "stayed-chart-tee",
  "ten-minutes-tee",
  "verify-tee",
  "block-one-tee",
  "hashrate-tee",
  "difficulty-adjusts-tee",
]);

function isShown(p: Product) {
  if (p.retired || RETIRED_SLUGS.has(p.slug)) return false;
  try {
    return !photoKindMismatch(p);
  } catch {
    return true;
  }
}

const LIVE = products.filter(isShown);

export function liveProducts() {
  return LIVE;
}

/** Ranked pool for the homepage hero. Live sales first, then featured / trending. */
export function heroPool(count = 24) {
  const list = liveProducts();
  const score = (p: Product) =>
    (p.soldCount ?? 0) * 100 + (p.featured ? 10 : 0) + (p.trending ? 5 : 0);
  return [...list].sort((a, b) => score(b) - score(a)).slice(0, count);
}

export function productImage(product: Product, color?: string) {
  if (color && product.imagesByColor?.[color]) return product.imagesByColor[color];
  return product.image;
}

export const JEWELRY_COLORS: ColorOption[] = [
  { id: "gold", label: "Gold", hex: "#C9A227" },
  { id: "silver", label: "Silver", hex: "#C0C4C8" },
  { id: "rose", label: "Rose gold", hex: "#B76E79" },
  { id: "ink", label: "Ink", hex: "#0B0C0E" },
  { id: "btc", label: "Bitcoin orange", hex: "#F7931A" },
];

function mergeColors(...lists: (readonly ColorOption[] | undefined)[]): ColorOption[] {
  const merged: ColorOption[] = [];
  for (const list of lists) {
    for (const c of list ?? []) {
      if (!merged.some((x) => x.id === c.id)) merged.push(c);
    }
  }
  return merged;
}

/** Fabric / metal goods get swatches. Glass, ceramic, prints, and enamel stay as photographed. */
export function takesColourways(product: Product): "garment" | "jewelry" | false {
  if (product.category === "drinkware" || product.category === "posters") return false;
  if (product.category === "jewelry") return "jewelry";
  if (product.category === "bags") return "garment";
  if (["tees", "hoodies", "longsleeves", "hats", "swimwear"].includes(product.category)) return "garment";
  if (product.category === "accessories") {
    if (product.slug.includes("sticker") || product.slug.includes("pin")) return false;
    return "garment";
  }
  if (product.category === "home" && product.slug.includes("throw")) return "garment";
  return false;
}

export function colorsFor(product: Product): ColorOption[] | undefined {
  const mode = takesColourways(product);
  if (mode === "jewelry") return mergeColors(product.colors, JEWELRY_COLORS);
  if (mode === "garment") return mergeColors(product.colors, CLOTHING_COLORS);
  if (product.imagesByColor) {
    const palette = [...TEE_COLORS, ...HOUSE_COLORS, ...CLOTHING_COLORS, ...(product.colors ?? [])];
    return Object.keys(product.imagesByColor).map((id) => {
      const hit = palette.find((c) => c.id === id);
      return hit ?? { id, label: id, hex: "#888888" };
    });
  }
  return product.colors;
}

/** Start on a photographed colour so the first frame matches the studio shot. */
export function defaultColorId(product: Product) {
  const colors = colorsFor(product);
  const shot = product.imagesByColor ? Object.keys(product.imagesByColor)[0] : undefined;
  if (shot && colors?.some((c) => c.id === shot)) return shot;
  return colors?.[0]?.id ?? "";
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function isLiveProduct(slug: string) {
  const p = getProduct(slug);
  return Boolean(p && isShown(p));
}

/** Looks up size × colour first; falls back to a single mapped variant. 0 = not mapped yet. */
export function printfulVariantId(slug: string, size?: string, color?: string) {
  const p = getProduct(slug);
  if (!p?.printful) return 0;
  const key = `${size ?? ""}:${color ?? ""}`;
  return p.printful.variants?.[key] ?? p.printful.variantId ?? 0;
}

export function productKind(p: Product) {
  if (p.kind) return p.kind;
  const s = p.slug;
  if (s.includes("beanie")) return "beanie";
  if (s.includes("bucket")) return "bucket";
  if (s.includes("snapback")) return "snapback";
  if (s.includes("trucker")) return "trucker";
  if (s.includes("flexfit")) return "flexfit";
  if (s.includes("distressed")) return "distressed";
  if (s.includes("vintage")) return "vintage";
  if (p.category === "hats") return "dad";
  if (s.includes("zip")) return "zip";
  if (s.includes("crew")) return "crew";
  if (s.includes("pullover")) return "pullover";
  if (p.category === "hoodies") return "hoodie";
  if (s.includes("crop")) return "crop";
  if (s.includes("tank") && p.cut === "women") return "tank";
  if (s.includes("vneck")) return "vneck";
  if (s.includes("whiskey") || s.includes("whisky")) return "whiskey";
  if (s.includes("shot")) return "shot";
  if (s.includes("tumbler")) return "tumbler";
  if (s.includes("pint")) return "pint";
  if (s.includes("coaster")) return "coaster";
  if (p.category === "drinkware" || s.includes("mug")) return "mug";
  if (s.includes("bikini")) return "bikini";
  if (s.includes("one-piece") || s.includes("onepiece") || p.kind === "onepiece") return "onepiece";
  if (s.includes("rash")) return "rash";
  if (p.category === "swimwear" && s.includes("cap")) return "cap";
  if (p.category === "swimwear" && (s.includes("short") || s.includes("board"))) return "shorts";
  return undefined;
}

export function productsIn(slug: string) {
  const list = liveProducts();
  if (slug === "trending") return list.filter((p) => p.trending || p.featured);
  if (slug === "events") return list.filter((p) => p.event);
  if (slug === "family" || slug === "kids")
    return list.filter((p) => p.cut === "youth" || p.cut === "toddler" || p.cut === "infant");
  if (slug === "youth") return list.filter((p) => p.cut === "youth");
  if (slug === "toddler") return list.filter((p) => p.cut === "toddler");
  if (slug === "infant") return list.filter((p) => p.cut === "infant");
  if (slug === "women")
    return list.filter((p) => p.cut === "women" && p.category !== "swimwear");
  if (slug === "women-crop") return list.filter((p) => p.cut === "women" && productKind(p) === "crop");
  if (slug === "women-tanks") return list.filter((p) => p.cut === "women" && productKind(p) === "tank");
  if (slug === "women-vneck") return list.filter((p) => p.cut === "women" && productKind(p) === "vneck");
  if (slug === "memes") return list.filter((p) => p.tag === "Meme");
  if (slug === "premium") return list.filter((p) => p.finish === "embroidery" || p.tag === "Premium");
  if (slug === "home") return list.filter((p) => p.category === "home" || p.category === "drinkware" || p.category === "posters");
  if (slug === "crewnecks") return list.filter((p) => productKind(p) === "crew");
  if (slug === "sweatshirts")
    return list.filter((p) => p.category === "hoodies" || ["hoodie", "pullover", "crew", "zip"].includes(productKind(p) ?? ""));
  if (slug === "hoodies") return list.filter((p) => productKind(p) === "hoodie");
  if (slug === "pullovers") return list.filter((p) => productKind(p) === "pullover");
  if (slug === "zip-ups") return list.filter((p) => productKind(p) === "zip");
  if (slug === "dad-hats") return list.filter((p) => productKind(p) === "dad");
  if (slug === "beanies") return list.filter((p) => productKind(p) === "beanie");
  if (slug === "bucket-hats") return list.filter((p) => productKind(p) === "bucket");
  if (slug === "distressed-hats") return list.filter((p) => productKind(p) === "distressed");
  if (slug === "flexfit-hats") return list.filter((p) => productKind(p) === "flexfit");
  if (slug === "snapback-hats") return list.filter((p) => productKind(p) === "snapback");
  if (slug === "trucker-hats") return list.filter((p) => productKind(p) === "trucker");
  if (slug === "vintage-hats") return list.filter((p) => productKind(p) === "vintage");
  if (slug === "drinkware")
    return list.filter(
      (p) =>
        p.category === "drinkware" ||
        ["mug", "tumbler", "pint", "whiskey", "shot", "coaster"].includes(productKind(p) ?? ""),
    );
  if (slug === "coffee-mugs") return list.filter((p) => productKind(p) === "mug");
  if (slug === "tumblers") return list.filter((p) => productKind(p) === "tumbler");
  if (slug === "pint-glasses") return list.filter((p) => productKind(p) === "pint");
  if (slug === "whiskey-glasses") return list.filter((p) => productKind(p) === "whiskey");
  if (slug === "shot-glasses") return list.filter((p) => productKind(p) === "shot");
  if (slug === "coasters") return list.filter((p) => productKind(p) === "coaster");
  if (slug === "swimwear") return list.filter((p) => p.category === "swimwear");
  if (slug === "swim-men")
    return list.filter((p) => p.category === "swimwear" && p.cut === "unisex");
  if (slug === "swim-women") return list.filter((p) => p.category === "swimwear" && p.cut === "women");
  if (slug === "swim-kids")
    return list.filter(
      (p) => p.category === "swimwear" && (p.cut === "youth" || p.cut === "toddler" || p.cut === "infant"),
    );
  if (slug === "bikinis") return list.filter((p) => productKind(p) === "bikini");
  if (slug === "swim-shorts") return list.filter((p) => p.category === "swimwear" && productKind(p) === "shorts");
  if (slug === "one-pieces") return list.filter((p) => productKind(p) === "onepiece");
  if (slug === "rash-guards") return list.filter((p) => productKind(p) === "rash");
  if (slug === "swim-caps") return list.filter((p) => p.category === "swimwear" && productKind(p) === "cap");
  if (slug === "mummy-daddy")
    return list.filter((p) => p.slug.startsWith("bitcoin-mummy") || p.slug.startsWith("bitcoin-daddy"));
  if (slug === "bitcoin-mummy") return list.filter((p) => p.slug.startsWith("bitcoin-mummy"));
  if (slug === "bitcoin-daddy") return list.filter((p) => p.slug.startsWith("bitcoin-daddy"));
  return list.filter((p) => p.category === slug);
}

export function searchProducts(q: string) {
  const n = q.trim().toLowerCase();
  const list = liveProducts();
  if (!n) return list;
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(n) ||
      p.tag.toLowerCase().includes(n) ||
      p.editionId.toLowerCase().includes(n) ||
      p.description.toLowerCase().includes(n) ||
      p.category.includes(n),
  );
}

const KIND_LABELS: Record<string, string> = {
  hoodie: "Hoodie",
  pullover: "Pullover",
  crew: "Crewneck",
  zip: "Zip-up",
  beanie: "Beanie",
  bucket: "Bucket hat",
  snapback: "Snapback",
  trucker: "Trucker",
  flexfit: "Flexfit",
  distressed: "Distressed hat",
  vintage: "Vintage hat",
  dad: "Dad hat",
  crop: "Crop",
  tank: "Tank",
  vneck: "V-neck",
  tumbler: "Tumbler",
  pint: "Pint",
  whiskey: "Whiskey glass",
  shot: "Shot glass",
  coaster: "Coaster",
  mug: "Mug",
  bikini: "Bikini",
  onepiece: "One-piece",
  rash: "Rash guard",
  cap: "Swim cap",
  shorts: "Swim shorts",
};

export function productKindLabel(p: Product) {
  const k = productKind(p);
  if (k && KIND_LABELS[k]) return KIND_LABELS[k];
  if (p.cut === "youth") return "Youth";
  if (p.cut === "toddler") return "Toddler";
  if (p.cut === "infant") return "Infant";
  if (p.category === "tees") return "T-shirt";
  if (p.category === "longsleeves") return "Long sleeve";
  if (p.category === "hats") return "Hat";
  if (p.category === "posters") return "Poster";
  if (p.category === "bags") return "Bag";
  if (p.category === "jewelry") return "Jewelry";
  if (p.category === "accessories") return "Sticker";
  return p.tag;
}

export function collectionFor(p: Product): { href: string; label: string } {
  const k = productKind(p);
  if (k === "hoodie") return { href: "/collection/hoodies", label: "Hoodies" };
  if (k === "pullover") return { href: "/collection/pullovers", label: "Pullovers" };
  if (k === "crew") return { href: "/collection/crewnecks", label: "Crewnecks" };
  if (k === "zip") return { href: "/collection/zip-ups", label: "Zip-ups" };
  if (k === "whiskey") return { href: "/collection/whiskey-glasses", label: "Whiskey glasses" };
  if (k === "shot") return { href: "/collection/shot-glasses", label: "Shot glasses" };
  if (p.category === "swimwear") return { href: "/collection/swimwear", label: "Swimwear" };
  if (p.cut === "youth" || p.cut === "toddler" || p.cut === "infant")
    return { href: "/collection/kids", label: "Kids" };
  if (p.cut === "women") return { href: "/collection/women", label: "Women" };
  if (p.category === "tees") return { href: "/collection/tees", label: "T-Shirts" };
  if (p.category === "longsleeves") return { href: "/collection/longsleeves", label: "Long sleeves" };
  if (p.category === "hats") return { href: "/collection/hats", label: "Hats" };
  if (p.category === "drinkware" || p.category === "home")
    return { href: "/collection/drinkware", label: "Drinkware" };
  if (p.category === "jewelry") return { href: "/collection/jewelry", label: "Jewelry" };
  if (p.category === "posters") return { href: "/collection/posters", label: "Posters" };
  if (p.category === "bags") return { href: "/collection/bags", label: "Bags" };
  return { href: "/shop", label: "Shop" };
}

export function colorLabel(p: Product, colorId?: string) {
  if (!colorId) return "";
  return colorsFor(p)?.find((c) => c.id === colorId)?.label ?? colorId;
}

export function sizeLabel(p: Product, sizeId?: string) {
  if (!sizeId) return "";
  return p.sizes?.find((s) => s.id === sizeId)?.label ?? sizeId;
}

/** Same joke / mark on a different object (hoodie vs tee vs mug). */
export function markKey(p: Product) {
  return p.slug.toLowerCase().replace(
    /-(tee|hoodie|crew|zip|pullover|mug|tumbler|pint|whiskey|shot|coasters|tote|pack|hat|cap|beanie|poster|print|sticker|pin|pendant|bracelet|longsleeve|vneck|tank|crop|youth|toddler|infant|dad-hat|trucker-hat|bucket-hat|flexfit-hat|vintage-hat|distressed-hat|swim-shorts|board-shorts|bikini|one-piece|rash-guard|swim-cap|youth-swim|toddler-swim)$/i,
    "",
  );
}

export function relatedProducts(slug: string, limit = 4) {
  const list = liveProducts();
  const p = getProduct(slug);
  if (!p) return list.filter((x) => x.featured).slice(0, limit);
  const mark = markKey(p);
  const sameMark = list.filter((x) => x.slug !== slug && markKey(x) === mark);
  const rest = list.filter(
    (x) => x.slug !== slug && markKey(x) !== mark && (x.tag === p.tag || x.category === p.category || x.featured),
  );
  return [...sameMark, ...rest].slice(0, limit);
}

export function formatGbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export const SIZE_CHART = {
  tees: [
    { size: "XS", chest: "86–91", length: "68" },
    { size: "S", chest: "96–101", length: "70" },
    { size: "M", chest: "101–106", length: "72" },
    { size: "L", chest: "106–111", length: "74" },
    { size: "XL", chest: "111–116", length: "76" },
    { size: "2XL", chest: "116–121", length: "78" },
    { size: "3XL", chest: "121–127", length: "80" },
    { size: "4XL", chest: "127–132", length: "82" },
  ],
  hoodies: [
    { size: "XS", chest: "102–108", length: "66" },
    { size: "S", chest: "108–114", length: "68" },
    { size: "M", chest: "114–120", length: "70" },
    { size: "L", chest: "120–126", length: "72" },
    { size: "XL", chest: "126–132", length: "74" },
    { size: "2XL", chest: "132–138", length: "76" },
    { size: "3XL", chest: "138–144", length: "78" },
    { size: "4XL", chest: "144–150", length: "80" },
  ],
};
