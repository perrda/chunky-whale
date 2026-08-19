export type NavChild = { href: string; label: string };
export type NavItem = { href: string; label: string; children?: NavChild[] };

/** Mirrors a serious Bitcoin merch house IA — original labels, not FOMO21 slogans. */
export const MEGA_NAV: NavItem[] = [
  { href: "/collection/trending", label: "Trending" },
  { href: "/collection/tees", label: "T-Shirts" },
  {
    href: "/collection/hoodies",
    label: "Sweatshirts",
    children: [
      { href: "/collection/crewnecks", label: "Crewnecks" },
      { href: "/collection/hoodies", label: "Hoodies" },
      { href: "/collection/pullovers", label: "Pullovers" },
      { href: "/collection/zip-ups", label: "Zip-ups" },
    ],
  },
  {
    href: "/collection/women",
    label: "Women",
    children: [
      { href: "/collection/women-crop", label: "Crop tops" },
      { href: "/collection/women-tanks", label: "Tank tops" },
      { href: "/collection/women-vneck", label: "V-neck tees" },
    ],
  },
  {
    href: "/collection/hats",
    label: "Hats",
    children: [
      { href: "/collection/beanies", label: "Beanies" },
      { href: "/collection/bucket-hats", label: "Bucket hats" },
      { href: "/collection/dad-hats", label: "Dad hats" },
      { href: "/collection/distressed-hats", label: "Distressed hats" },
      { href: "/collection/flexfit-hats", label: "Flexfit hats" },
      { href: "/collection/snapback-hats", label: "Snapback hats" },
      { href: "/collection/trucker-hats", label: "Trucker hats" },
      { href: "/collection/vintage-hats", label: "Vintage hats" },
    ],
  },
  {
    href: "/collection/kids",
    label: "Kids",
    children: [
      { href: "/collection/youth", label: "Youth" },
      { href: "/collection/toddler", label: "Toddler" },
      { href: "/collection/infant", label: "Infant" },
    ],
  },
  {
    href: "/collection/drinkware",
    label: "Drinkware",
    children: [
      { href: "/collection/coffee-mugs", label: "Coffee mugs" },
      { href: "/collection/coasters", label: "Coasters" },
      { href: "/collection/pint-glasses", label: "Pint glasses" },
      { href: "/collection/tumblers", label: "Tumblers" },
    ],
  },
  {
    href: "/shop",
    label: "Collections",
    children: [
      { href: "/collection/memes", label: "Memes" },
      { href: "/collection/premium", label: "Stitched / premium" },
      { href: "/collection/jewelry", label: "Jewelry" },
      { href: "/collection/posters", label: "Posters" },
      { href: "/collection/accessories", label: "Stickers & pins" },
      { href: "/collection/bags", label: "Bags" },
      { href: "/collection/longsleeves", label: "Long sleeves" },
    ],
  },
];

export const HOME_COLLECTIONS = [
  { slug: "tees", label: "T-Shirts", blurb: "₿ on the chest." },
  { slug: "hoodies", label: "Sweatshirts", blurb: "Hoodies, crew, zip." },
  { slug: "hats", label: "Hats", blurb: "Dad, snapback, bucket, beanie." },
  { slug: "women", label: "Women", blurb: "V-neck, tank, crop." },
  { slug: "kids", label: "Kids", blurb: "Youth to infant." },
  { slug: "drinkware", label: "Drinkware", blurb: "Mugs, tumblers, pints." },
  { slug: "jewelry", label: "Jewelry", blurb: "Pendants and chains." },
  { slug: "posters", label: "Posters", blurb: "Charts and 21 million." },
];

export const COLLECTION_META: { slug: string; label: string; blurb: string }[] = [
  { slug: "trending", label: "Trending", blurb: "What Bitcoiners are grabbing." },
  ...HOME_COLLECTIONS,
  { slug: "crewnecks", label: "Crewnecks", blurb: "No hood. Same ₿." },
  { slug: "pullovers", label: "Pullovers", blurb: "Heavy cotton, no zip." },
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
  { slug: "tumblers", label: "Tumblers", blurb: "Steel. Desk stack." },
  { slug: "memes", label: "Memes", blurb: "The lines Bitcoiners already shout." },
  { slug: "premium", label: "Premium stitch", blurb: "Embroidery, not cheap DTG." },
  { slug: "accessories", label: "Stickers & pins", blurb: "Laptop and lapel." },
  { slug: "bags", label: "Bags", blurb: "Totes." },
  { slug: "longsleeves", label: "Long sleeves", blurb: "Conference weather." },
];

