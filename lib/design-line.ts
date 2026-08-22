/** Browser-safe. Same joke / mark across tee, hoodie, glass, tote. No fs/sharp. */
import type { Product } from "./products";

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
  reserve: "reserve",
  "strategic-reserve": "reserve",
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
  "proof-of-work",
  "not-your-keys",
  "sound-money",
  "cold-storage",
  "self-custody",
  "digital-energy",
  "b-mark",
  "one-btc",
  "satoshi",
  "stay-solvent",
  "peer-to-peer",
  "genesis",
  "infinite-fiat",
  "run-node",
  "one-sat",
  "hard-cap",
  "no-second",
  "one-more-block",
  "dip-feature",
  "number-go-up",
  "cant-print",
  "bitcoin-fixes",
  "the-joke",
  "orange-daily",
  "future-utxo",
  "node-toddler",
  "verify",
  "hodl",
  "keys",
  "catches-on",
  "nothing-stops",
  "zoom-out",
  "good-for-btc",
  "sats-standard",
  "vires",
  "bitcoin-hope",
  "boating",
  "inflation-theft",
  "forever-laura",
  "buy-the-dip",
  "house-stacks",
  "block-zero",
  "verify-hodl",
  "sound-loud",
  "stackhouse-est",
  "polo-crest",
  "polo-center",
  "polo-mini",
  "quiet-b",
  "crest-b",
].sort((a, b) => b.length - a.length);

const KIND_TAIL =
  /-(tee|hoodie|crew|zip|pullover|mug|tumbler|pint|whiskey|shot|coasters|tote|pack|hat|cap|beanie|poster|print|sticker|pin|pendant|bracelet|necklace|longsleeve|vneck|tank|crop|youth|toddler|infant|dad-hat|trucker-hat|bucket-hat|flexfit-hat|vintage-hat|distressed-hat|swim-shorts|board-shorts|bikini|one-piece|rash-guard|swim-cap|youth-swim|toddler-swim|onesie)$/i;

export function lineKey(product: { slug: string }): string {
  const slug = product.slug.toLowerCase().replace(KIND_TAIL, "");
  for (const mark of MARK_PREFIXES) {
    if (slug === mark || slug.startsWith(`${mark}-`)) {
      return FAMILY_ALIASES[mark] ?? mark;
    }
  }
  return FAMILY_ALIASES[slug] ?? FAMILY_ALIASES[slug.split("-")[0] ?? ""] ?? slug;
}

const LINE_TITLES: Record<string, { label: string; blurb: string }> = {
  hodl: { label: "HODL", blurb: "I AM HODLING. Same line on cloth and glass." },
  "stack-sats": { label: "Stack sats", blurb: "The daily habit. Wear it or drink it." },
  "so-back": { label: "We are so back", blurb: "The group-chat pendulum. Not a price call." },
  "21-million": { label: "21 million", blurb: "That's the joke. Same cap on more than a tee." },
  "stay-humble": { label: "Stay humble", blurb: "Stay humble, stack sats." },
  "hard-money": { label: "Hard money", blurb: "The other kind of hard." },
  "bitcoin-mummy": { label: "Bitcoin Mummy", blurb: "School run. Node at home." },
  "bitcoin-daddy": { label: "Bitcoin Daddy", blurb: "The title. Gift it." },
  "few-understand": { label: "Few understand", blurb: "The line, on more than one object." },
  verify: { label: "Don't trust. Verify.", blurb: "Same joke, heavier cloth or glass." },
  "catches-on": { label: "In case it catches on", blurb: "Satoshi, 2009. Same line on cloth and glass." },
  "nothing-stops": { label: "Nothing stops this train", blurb: "The debt machine. Not a price call." },
  "zoom-out": { label: "When in doubt, zoom out", blurb: "The weekly candle is not the story." },
  "good-for-btc": { label: "This is good for Bitcoin", blurb: "Every headline. Same reply." },
  "sats-standard": { label: "Sats are the standard", blurb: "The unit. Not the dollar." },
  "vires": { label: "Vires in numeris", blurb: "Strength in numbers." },
  "bitcoin-hope": { label: "Bitcoin is hope", blurb: "Not a ticker. A reason." },
  "boating": { label: "Boating accident", blurb: "The keys went swimming." },
  "inflation-theft": { label: "Inflation is theft", blurb: "The printer is the joke." },
  "forever-laura": { label: "Forever, Laura", blurb: "A joke. Not a forecast." },
  "buy-the-dip": { label: "Buy the dip", blurb: "Cycle mood. Not advice." },
  "house-stacks": { label: "The house always stacks", blurb: "House joke. We stack." },
  "block-zero": { label: "Block zero", blurb: "Genesis energy." },
  "verify-hodl": { label: "Verify then HODL", blurb: "Check the keys. Then sit." },
  "sound-loud": { label: "Sound money, loud shirt", blurb: "Quiet money. Loud cotton." },
  "stackhouse-est": { label: "STACKHOUSE Est. 2009", blurb: "House mark. Genesis year." },
  "polo-crest": { label: "Stitched ₿ polo", blurb: "Left chest. Dinner-safe." },
  "polo-center": { label: "Center ₿ polo", blurb: "One stitched mark." },
  "polo-mini": { label: "Mini ₿ polo", blurb: "The smallest stitch." },
  "quiet-b": { label: "Quiet ₿", blurb: "Just the mark." },
  "crest-b": { label: "Crest ₿", blurb: "Left chest on a tee." },
};

/** Lines with enough live SKUs to shop as a family. */
export const FEATURED_LINES = [
  { slug: "hodl", ...LINE_TITLES.hodl },
  { slug: "stack-sats", ...LINE_TITLES["stack-sats"] },
  { slug: "so-back", ...LINE_TITLES["so-back"] },
  { slug: "21-million", ...LINE_TITLES["21-million"] },
  { slug: "stay-humble", ...LINE_TITLES["stay-humble"] },
  { slug: "hard-money", ...LINE_TITLES["hard-money"] },
  { slug: "bitcoin-mummy", ...LINE_TITLES["bitcoin-mummy"] },
  { slug: "bitcoin-daddy", ...LINE_TITLES["bitcoin-daddy"] },
] as const;

export function lineMeta(key: string) {
  return LINE_TITLES[key] ?? { label: key.replace(/-/g, " "), blurb: "Same joke, another object." };
}

export function lineLabel(product: Product | { slug: string }) {
  return lineMeta(lineKey(product)).label;
}

export function isFeaturedLine(slug: string) {
  return FEATURED_LINES.some((l) => l.slug === slug);
}
