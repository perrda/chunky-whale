export type NavChild = { href: string; label: string };
export type NavItem = { href: string; label: string; children?: NavChild[] };

/** Five top links. The rest live under Shop — not a second row of categories. */
export const MEGA_NAV: NavItem[] = [
  { href: "/collection/tees", label: "T-Shirts" },
  {
    href: "/collection/sweatshirts",
    label: "Sweatshirts",
    children: [
      { href: "/collection/hoodies", label: "Hoodies" },
      { href: "/collection/pullovers", label: "Pullovers" },
      { href: "/collection/crewnecks", label: "Crewnecks" },
    ],
  },
  {
    href: "/collection/hats",
    label: "Hats",
    children: [
      { href: "/collection/dad-hats", label: "Dad hats" },
      { href: "/collection/hats", label: "All hats" },
    ],
  },
  {
    href: "/collection/drinkware",
    label: "Drinkware",
    children: [
      { href: "/collection/whiskey-glasses", label: "Whiskey glasses" },
      { href: "/collection/shot-glasses", label: "Shot glasses" },
    ],
  },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/collection/women", label: "Women" },
      { href: "/collection/kids", label: "Kids" },
      { href: "/collection/mummy-daddy", label: "Mummy & Daddy" },
      { href: "/collection/hodl", label: "HODL" },
      { href: "/collection/so-back", label: "We are so back" },
      { href: "/collection/21-million", label: "21 million" },
      { href: "/collection/memes", label: "Memes" },
      { href: "/collection/longsleeves", label: "Long sleeves" },
      { href: "/collection/premium", label: "Stitched / premium" },
    ],
  },
];

/** Hats collection chips — more types than the slim header dropdown. */
export const HAT_SECTIONS: NavChild[] = [
  { href: "/collection/dad-hats", label: "Dad hats" },
];

export const WOMEN_SECTIONS: NavChild[] = [
  { href: "/collection/women-crop", label: "Crop tops" },
  { href: "/collection/women-tanks", label: "Tank tops" },
  { href: "/collection/women-vneck", label: "V-neck tees" },
];

export const KIDS_SECTIONS: NavChild[] = [
  { href: "/collection/youth", label: "Youth" },
];

/** Swimwear collection chips stay on the swim page, not under Women. */
export const SWIM_SECTIONS: NavChild[] = [
  { href: "/collection/swim-men", label: "Men" },
  { href: "/collection/swim-women", label: "Women" },
  { href: "/collection/swim-kids", label: "Kids" },
  { href: "/collection/bikinis", label: "Bikinis" },
  { href: "/collection/swim-shorts", label: "Swim shorts" },
  { href: "/collection/one-pieces", label: "One-pieces" },
  { href: "/collection/rash-guards", label: "Rash guards" },
  { href: "/collection/swim-caps", label: "Swim caps" },
];

/** Shop page chips — keep the first row short. The rest sit under More. */
export const SHOP_FILTERS = [
  { slug: "tees", label: "T-Shirts" },
  { slug: "sweatshirts", label: "Sweatshirts" },
  { slug: "hats", label: "Hats" },
  { slug: "women", label: "Women" },
  { slug: "kids", label: "Kids" },
  { slug: "drinkware", label: "Drinkware" },
] as const;

export const SHOP_MORE_FILTERS = [
  { slug: "mummy-daddy", label: "Mummy & Daddy" },
  { slug: "hodl", label: "HODL" },
  { slug: "so-back", label: "So Back" },
  { slug: "21-million", label: "21 million" },
  { slug: "longsleeves", label: "Long sleeves" },
  { slug: "memes", label: "Memes" },
  { slug: "premium", label: "Stitched" },
] as const;

export const HOME_DOORS = [
  { slug: "wear", label: "Wear it", blurb: "Tees, sweats, hats." },
  { slug: "drinkware", label: "Drink from it", blurb: "Whiskey and shot glasses." },
  { slug: "mummy-daddy", label: "Gift it", blurb: "Bitcoin Mummy. Bitcoin Daddy." },
] as const;

export const HOME_COLLECTIONS = [
  { slug: "tees", label: "T-Shirts", blurb: "₿ on the chest." },
  { slug: "sweatshirts", label: "Sweatshirts", blurb: "Hoodies, pullovers, crew, zip." },
  { slug: "hats", label: "Hats", blurb: "Dad hats with a stitched ₿." },
  { slug: "women", label: "Women", blurb: "V-neck, tank, crop." },
  { slug: "kids", label: "Kids", blurb: "Youth. Future UTXO." },
  { slug: "drinkware", label: "Drinkware", blurb: "Whiskey and shot glasses." },
  { slug: "mummy-daddy", label: "Mummy & Daddy", blurb: "Bitcoin Mummy. Bitcoin Daddy." },
];

/** Subsection links for a parent collection, or sibling links when already on a child. */
export function collectionNavFor(slug: string): {
  parentLabel: string;
  parentHref: string;
  children: NavChild[];
} | null {
  if (slug === "hats" || HAT_SECTIONS.some((c) => c.href === `/collection/${slug}`)) {
    return { parentLabel: "Hats", parentHref: "/collection/hats", children: HAT_SECTIONS };
  }
  if (slug === "women" || WOMEN_SECTIONS.some((c) => c.href === `/collection/${slug}`)) {
    return { parentLabel: "Women", parentHref: "/collection/women", children: WOMEN_SECTIONS };
  }
  if (slug === "kids" || KIDS_SECTIONS.some((c) => c.href === `/collection/${slug}`)) {
    return { parentLabel: "Kids", parentHref: "/collection/kids", children: KIDS_SECTIONS };
  }
  if (slug === "swimwear" || SWIM_SECTIONS.some((c) => c.href === `/collection/${slug}`)) {
    return { parentLabel: "Swimwear", parentHref: "/collection/swimwear", children: SWIM_SECTIONS };
  }
  const href = `/collection/${slug}`;
  const parent = MEGA_NAV.find((n) => n.href === href && n.children?.length);
  if (parent?.children) {
    return { parentLabel: parent.label, parentHref: parent.href, children: parent.children };
  }
  const owner = MEGA_NAV.find((n) => n.children?.some((c) => c.href === href));
  if (owner?.children && owner.label !== "Shop") {
    return { parentLabel: owner.label, parentHref: owner.href, children: owner.children };
  }
  return null;
}

export const COLLECTION_META: { slug: string; label: string; blurb: string }[] = [
  { slug: "trending", label: "Trending", blurb: "What Bitcoiners are grabbing." },
  ...HOME_COLLECTIONS,
  { slug: "hoodies", label: "Hoodies", blurb: "Hood and pocket. Same ₿." },
  { slug: "crewnecks", label: "Crewnecks", blurb: "No hood. Same ₿." },
  { slug: "pullovers", label: "Pullovers", blurb: "Heavy cotton. No hood, no zip." },
  { slug: "zip-ups", label: "Zip-ups", blurb: "On and off between halls." },
  { slug: "women-crop", label: "Crop tops", blurb: "Shorter hem. Same stack." },
  { slug: "women-tanks", label: "Tank tops", blurb: "Heat. ₿." },
  { slug: "women-vneck", label: "V-neck tees", blurb: "Closer cut." },
  { slug: "dad-hats", label: "Dad hats", blurb: "Low profile. Stitched ₿." },
  { slug: "beanies", label: "Beanies", blurb: "Cuff stitch." },
  { slug: "bucket-hats", label: "Bucket hats", blurb: "Sun and floor." },
  { slug: "distressed-hats", label: "Distressed hats", blurb: "Washed. Lived-in." },
  { slug: "flexfit-hats", label: "Flexfit hats", blurb: "Stretch. No clasp." },
  { slug: "snapback-hats", label: "Snapback hats", blurb: "Flat brim." },
  { slug: "trucker-hats", label: "Trucker hats", blurb: "Mesh back." },
  { slug: "vintage-hats", label: "Vintage hats", blurb: "Olive wash." },
  { slug: "youth", label: "Youth", blurb: "Future UTXO." },
  { slug: "toddler", label: "Toddler", blurb: "Small ₿." },
  { slug: "infant", label: "Infant", blurb: "Node in training." },
  { slug: "coffee-mugs", label: "Coffee mugs", blurb: "Morning conviction." },
  { slug: "coasters", label: "Coasters", blurb: "The table knows." },
  { slug: "pint-glasses", label: "Pint glasses", blurb: "After the conference." },
  { slug: "whiskey-glasses", label: "Whiskey glasses", blurb: "Rocks. Orange ₿. Nightcap." },
  { slug: "shot-glasses", label: "Shot glasses", blurb: "One ounce. Same joke." },
  { slug: "tumblers", label: "Tumblers", blurb: "Steel. Desk stack." },
  { slug: "memes", label: "Memes", blurb: "The lines Bitcoiners already shout." },
  { slug: "premium", label: "Premium stitch", blurb: "Embroidery, not cheap DTG." },
  { slug: "accessories", label: "Stickers & pins", blurb: "Laptop and lapel." },
  { slug: "bags", label: "Bags", blurb: "Totes." },
  { slug: "longsleeves", label: "Long sleeves", blurb: "Conference weather." },
  { slug: "swim-men", label: "Men’s swim", blurb: "Shorts, rash guards, caps." },
  { slug: "swim-women", label: "Women’s swim", blurb: "Bikinis, one-pieces, caps." },
  { slug: "swim-kids", label: "Kids’ swim", blurb: "Youth and toddler." },
  { slug: "bikinis", label: "Bikinis", blurb: "Two-piece. Same ₿." },
  { slug: "swim-shorts", label: "Swim shorts", blurb: "Board shorts. ₿ on the leg." },
  { slug: "one-pieces", label: "One-pieces", blurb: "Full coverage option." },
  { slug: "rash-guards", label: "Rash guards", blurb: "Long sleeve. UPF." },
  { slug: "swim-caps", label: "Swim caps", blurb: "Silicone. One joke." },
  { slug: "bitcoin-mummy", label: "Bitcoin Mummy", blurb: "The other half of the pair." },
  { slug: "bitcoin-daddy", label: "Bitcoin Daddy", blurb: "A dad hat that says it." },
  { slug: "wear", label: "Wear it", blurb: "Tees, sweats, hats, swim. The clothes." },
  { slug: "hodl", label: "HODL", blurb: "I AM HODLING. Same line on cloth and glass." },
  { slug: "stack-sats", label: "Stack sats", blurb: "The daily habit. Wear it or drink it." },
  { slug: "so-back", label: "We are so back", blurb: "The group-chat pendulum. Not a price call." },
  { slug: "21-million", label: "21 million", blurb: "That's the joke. Same cap on more than a tee." },
  { slug: "stay-humble", label: "Stay humble", blurb: "Stay humble, stack sats." },
  { slug: "hard-money", label: "Hard money", blurb: "The other kind of hard." },
];

