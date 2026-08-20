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
const WOMEN = APPAREL.filter((s) => s.id !== "3xl" && s.id !== "4xl");

const HOOD = ["Mid-weight fleece", "Hood and kangaroo pocket", "12 garment colours"];
const PULL = ["Heavy cotton fleece", "No hood, no zip, no pocket", "12 garment colours"];

type Mark = {
  id: string;
  name: string;
  short: string;
  desc: string;
  tag?: string;
  cut?: Product["cut"];
  featured?: boolean;
  trending?: boolean;
  /** Photographed colour — first view must not recolour or the type smears. */
  photo?: string;
};

function hoodie(m: Mark): Product {
  const image = `/products/${m.id}-hoodie.png`;
  return {
    slug: `${m.id}-hoodie`,
    name: `${m.name} Hoodie`,
    shortName: `${m.short} Hoodie`,
    editionId: `SH-D10-${m.id.toUpperCase().replace(/-/g, "").slice(0, 6)}-H`,
    priceGbp: 55,
    category: "hoodies",
    tag: m.tag ?? "Meme",
    kind: "hoodie",
    cut: m.cut ?? "unisex",
    featured: m.featured,
    trending: m.trending,
    colors: CLOTHING_COLORS,
    description: m.desc,
    details: m.cut === "women" ? [...HOOD, "Women’s cut XS–2XL"] : HOOD,
    image,
    imagesByColor: m.photo ? { [m.photo]: image } : undefined,
    sizes: m.cut === "women" ? WOMEN : APPAREL,
  };
}

function pullover(m: Mark): Product {
  const image = `/products/${m.id}-pullover.png`;
  return {
    slug: `${m.id}-pullover`,
    name: `${m.name} Pullover`,
    shortName: `${m.short} Pullover`,
    editionId: `SH-D10-${m.id.toUpperCase().replace(/-/g, "").slice(0, 6)}-P`,
    priceGbp: 52,
    category: "hoodies",
    tag: m.tag ?? "Meme",
    kind: "pullover",
    cut: m.cut ?? "unisex",
    featured: m.featured,
    trending: m.trending,
    colors: CLOTHING_COLORS,
    description: m.desc,
    details: m.cut === "women" ? [...PULL, "Women’s cut XS–2XL"] : PULL,
    image,
    imagesByColor: m.photo ? { [m.photo]: image } : undefined,
    sizes: m.cut === "women" ? WOMEN : APPAREL,
  };
}

const NEW_HOODIES: Mark[] = [
  {
    id: "stay-humble",
    name: "STAY HUMBLE",
    short: "Humble",
    desc: "The other half of stack sats. Hood on. Orange ₿.",
    tag: "Meme",
    photo: "forest",
  },
  {
    id: "proof-of-work",
    name: "PROOF OF WORK",
    short: "PoW",
    desc: "Energy, not a slogan deck. Fleece.",
    tag: "Meme",
    photo: "ink",
  },
  {
    id: "not-your-keys",
    name: "NOT YOUR KEYS",
    short: "Keys",
    desc: "Not your coins. Warmer now.",
    tag: "Meme",
    photo: "navy",
  },
  {
    id: "hard-money",
    name: "HARD MONEY",
    short: "Hard Money",
    desc: "Soft fleece. Hard cap. Orange ₿.",
    tag: "Copy",
    photo: "burgundy",
  },
  {
    id: "verify",
    name: "DON'T TRUST. VERIFY.",
    short: "Verify",
    desc: "Then pull the hood up.",
    tag: "Meme",
    featured: true,
    photo: "charcoal",
  },
  {
    id: "few-understand",
    name: "FEW UNDERSTAND",
    short: "Few",
    desc: "And they wear the hood anyway.",
    tag: "Meme",
    trending: true,
    photo: "ink",
  },
];

const NEW_PULLOVERS: Mark[] = [
  {
    id: "hodl",
    name: "I AM HODLING",
    short: "HODL",
    desc: "No hood. Same typo. Conference layer.",
    tag: "Meme",
    featured: true,
    photo: "charcoal",
  },
  {
    id: "stack-sats",
    name: "STACK SATS",
    short: "Stack",
    desc: "The daily habit, in heavy cotton.",
    tag: "Meme",
    photo: "forest",
  },
  {
    id: "timechain",
    name: "TIMECHAIN",
    short: "Timechain",
    desc: "The word before marketing got to it. No zip.",
    tag: "Copy",
    photo: "ink",
  },
  {
    id: "digital-energy",
    name: "DIGITAL ENERGY",
    short: "Digital Energy",
    desc: "Saylor’s frame. Crew neck. Orange ₿.",
    tag: "Meme",
    photo: "navy",
  },
  {
    id: "four-year",
    name: "FOUR YEAR TIDE",
    short: "Tide",
    desc: "The cycle, without a hood in the way.",
    tag: "Chart",
    photo: "royal",
  },
  {
    id: "b-mark",
    name: "₿",
    short: "B Mark",
    desc: "Just the mark. Heavy cotton. No explanation.",
    tag: "₿",
    photo: "ink",
  },
  {
    id: "stay-humble",
    name: "STAY HUMBLE",
    short: "Humble",
    desc: "Stack sats. No hood required.",
    tag: "Meme",
    photo: "charcoal",
  },
  {
    id: "proof-of-work",
    name: "PROOF OF WORK",
    short: "PoW",
    desc: "The line, on a pullover you can sit in.",
    tag: "Meme",
    photo: "burgundy",
  },
  {
    id: "not-your-keys",
    name: "NOT YOUR KEYS",
    short: "Keys",
    desc: "Not your coins. Crew neck.",
    tag: "Meme",
    photo: "navy",
  },
  {
    id: "hard-money",
    name: "HARD MONEY",
    short: "Hard Money",
    desc: "Soft cotton. Hard cap.",
    tag: "Copy",
    photo: "forest",
  },
  {
    id: "sound-money",
    name: "SOUND MONEY",
    short: "Sound Money",
    desc: "Quiet cloth. Loud rule.",
    tag: "Copy",
    photo: "ink",
  },
  {
    id: "cold-storage",
    name: "COLD STORAGE",
    short: "Cold Storage",
    desc: "Keys offline. You, slightly warmer.",
    tag: "Meme",
    photo: "navy",
  },
  {
    id: "self-custody",
    name: "SELF CUSTODY",
    short: "Self Custody",
    desc: "Nobody else holds this layer.",
    tag: "Meme",
    photo: "charcoal",
  },
  {
    id: "verify",
    name: "DON'T TRUST. VERIFY.",
    short: "Verify",
    desc: "Then put the pullover on.",
    tag: "Meme",
    photo: "ink",
  },
  {
    id: "few-understand",
    name: "FEW UNDERSTAND",
    short: "Few",
    desc: "Crew neck. Same ₿.",
    tag: "Meme",
    photo: "olive",
  },
  {
    id: "bitcoin-mummy",
    name: "BITCOIN MUMMY",
    short: "Mummy",
    desc: "School-gate cotton. No hood. Orange ₿.",
    tag: "Family",
    cut: "women",
    trending: true,
    photo: "royal",
  },
  {
    id: "bitcoin-daddy",
    name: "BITCOIN DADDY",
    short: "Daddy",
    desc: "The title, without the hood.",
    tag: "Family",
    trending: true,
    photo: "ink",
  },
];

export const drop10Sweats: Product[] = [
  ...NEW_HOODIES.map(hoodie),
  ...NEW_PULLOVERS.map(pullover),
];
