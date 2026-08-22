import { CLOTHING_COLORS } from "./drop-07";
import type { Product } from "./products";
import sayings from "./sayings.json";

type Saying = {
  id: string;
  name: string;
  short: string;
  desc: string;
  tag?: string;
  featured?: boolean;
  trending?: boolean;
};

const TEE = ["180–220gsm cotton", "Printed on demand", "Unisex cut unless noted"];
const HOOD = ["Mid-weight fleece", "Hood and kangaroo pocket", "12 garment colours"];
const PULL = ["Heavy cotton fleece", "No hood, no zip, no pocket", "12 garment colours"];
const WHISKEY = ["Rocks / whiskey glass", "Printed on demand", "Hand wash recommended"];
const SHOT = ["Shot glass", "Printed on demand", "Hand wash recommended"];
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

function loadMarks(): Saying[] {
  return sayings.marks as Saying[];
}

function edition(id: string, suffix: string) {
  return `SH-D12-${id.toUpperCase().replace(/-/g, "").slice(0, 6)}-${suffix}`;
}

function tee(m: Saying): Product {
  return {
    slug: `${m.id}-tee`,
    name: m.name,
    shortName: m.short,
    editionId: edition(m.id, "T"),
    priceGbp: 28,
    category: "tees",
    tag: m.tag ?? "Meme",
    featured: m.featured,
    trending: m.trending,
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: m.desc,
    details: TEE,
    image: `/products/${m.id}-tee.png`,
    sizes: APPAREL,
  };
}

function hoodie(m: Saying): Product {
  return {
    slug: `${m.id}-hoodie`,
    name: `${m.name} Hoodie`,
    shortName: `${m.short} Hoodie`,
    editionId: edition(m.id, "H"),
    priceGbp: 55,
    category: "hoodies",
    tag: m.tag ?? "Meme",
    kind: "hoodie",
    featured: m.featured,
    trending: m.trending,
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: m.desc,
    details: HOOD,
    image: `/products/${m.id}-hoodie.png`,
    sizes: APPAREL,
  };
}

function pullover(m: Saying): Product {
  return {
    slug: `${m.id}-pullover`,
    name: `${m.name} Pullover`,
    shortName: `${m.short} Pullover`,
    editionId: edition(m.id, "P"),
    priceGbp: 52,
    category: "hoodies",
    tag: m.tag ?? "Meme",
    kind: "pullover",
    cut: "unisex",
    colors: CLOTHING_COLORS,
    description: m.desc,
    details: PULL,
    image: `/products/${m.id}-pullover.png`,
    sizes: APPAREL,
  };
}

function whiskey(m: Saying): Product {
  return {
    slug: `${m.id}-whiskey`,
    name: `${m.name} Whiskey Glass`,
    shortName: `${m.short} Whiskey`,
    editionId: edition(m.id, "W"),
    priceGbp: 20,
    category: "drinkware",
    tag: m.tag ?? "Meme",
    kind: "whiskey",
    featured: m.featured,
    description: m.desc,
    details: WHISKEY,
    image: `/products/${m.id}-whiskey.png`,
  };
}

function shot(m: Saying): Product {
  return {
    slug: `${m.id}-shot`,
    name: `${m.name} Shot Glass`,
    shortName: `${m.short} Shot`,
    editionId: edition(m.id, "S"),
    priceGbp: 12,
    category: "drinkware",
    tag: m.tag ?? "Meme",
    kind: "shot",
    description: m.desc,
    details: SHOT,
    image: `/products/${m.id}-shot.png`,
  };
}

const marks = loadMarks();

export const drop12Sayings: Product[] = marks.flatMap((m) => [tee(m), hoodie(m), pullover(m), whiskey(m), shot(m)]);
