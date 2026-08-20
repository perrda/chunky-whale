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
