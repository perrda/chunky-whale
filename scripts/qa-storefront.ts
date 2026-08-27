/**
 * Storefront consistency — filters, counts, checkout math, glassware, copy.
 * Run: npm run qa:storefront
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { allowedPrintFilenames, auditPrintSources } from "../lib/catalog-print-allowlist";
import { SHOP_FILTERS, SHOP_MORE_FILTERS, MEGA_NAV, liveCollectionMeta } from "../lib/nav";
import { gbpAmountsMatch, gbpToPence, penceMatchesGbp } from "../lib/payments/amount";
import { defaultColorId, getProduct, liveProducts, productsIn, RETIRED_SLUGS, takesColourways } from "../lib/products";
import { basketTotals } from "../lib/shipping";

const live = liveProducts();
assert.ok(live.length > 80, `live catalog too thin (${live.length})`);

const hoodies = productsIn("hoodies");
const pullovers = productsIn("pullovers");
assert.ok(hoodies.length >= 20, `hoodies ${hoodies.length} — need 20 unique`);
assert.ok(pullovers.length >= 20, `pullovers ${pullovers.length} — need 20 unique`);
assert.ok(
  !hoodies.some((p) => pullovers.some((q) => q.slug === p.slug)),
  "hoodie listed as pullover",
);

assert.ok(productsIn("whiskey-glasses").length >= 20, "whiskey range thin");
assert.ok(productsIn("shot-glasses").length >= 20, "shot range thin");
assert.ok(productsIn("mummy-daddy").length >= 4, "Mummy & Daddy shop filter would be empty");
assert.ok(RETIRED_SLUGS.has("log-chart-mug"), "log-chart-mug must stay retired — chart wrap was unreadable");
assert.ok(productsIn("hats").length >= 1, "Hats collection empty");
assert.equal(productsIn("swimwear").length, 0, "failed swim photos must stay retired");
assert.ok(
  productsIn("drinkware").every((p) => p.kind === "whiskey" || p.kind === "shot"),
  "Drinkware must be renderer whiskey/shot only",
);

for (const slug of [...SHOP_FILTERS, ...SHOP_MORE_FILTERS].map((c) => c.slug)) {
  const n = productsIn(slug).length;
  assert.ok(n > 0, `shop filter ${slug} is empty`);
}

const women = productsIn("women");
assert.ok(women.every((p) => p.category !== "swimwear"), "Women collection includes swimwear");
assert.ok(women.length > 0, "Women collection empty");

assert.deepEqual(
  MEGA_NAV.map((n) => n.label),
  ["T-Shirts", "Sweatshirts", "Hats", "Drinkware", "Shop"],
  "header must stay five links",
);
assert.ok(!MEGA_NAV.some((n) => n.label === "Women"), "Women is under Shop, not a top link");
const shopNav = MEGA_NAV.find((n) => n.label === "Shop");
assert.ok(shopNav);
assert.ok(shopNav.children?.some((c) => c.href === "/collection/women"), "Shop must still reach Women");
assert.ok(!shopNav.children?.some((c) => c.href === "/collection/swimwear"), "Shop must not list retired Swimwear");
assert.ok(
  !shopNav.children?.some((c) => /bikini|one-piece/i.test(c.href)),
  "Shop dropdown still lists swim subsections",
);
assert.ok(productsIn("hodl").length >= 2, "HODL line too thin");
assert.ok(productsIn("so-back").length >= 2, "So Back line too thin");
assert.ok(productsIn("21-million").length >= 2, "21 million line too thin");
assert.ok(productsIn("wear").length > 20, "Wear it door empty");
assert.ok(productsIn("polos").length >= 3, "polo range thin — need crest / center / mini");
assert.ok(
  liveCollectionMeta().every((c) => productsIn(c.slug).length > 0),
  "sitemap/static collections must have live pieces",
);
assert.ok(
  !liveCollectionMeta().some((c) => c.slug === "beanies" || c.slug === "swimwear" || c.slug === "bags"),
  "retired empty collections must stay out of the live sitemap",
);
assert.ok(productsIn("polos").every((p) => /₿|bitcoin/i.test(`${p.name} ${p.description}`)), "polo must be ₿-only formal wear");
const teeNav = MEGA_NAV.find((n) => n.label === "T-Shirts");
assert.ok(teeNav?.children?.some((c) => c.href === "/collection/polos"), "T-Shirts menu must reach Polo shirts");

const searchSrc = readFileSync(path.join(process.cwd(), "components/SearchBox.tsx"), "utf8");
assert.doesNotMatch(searchSrc, /hidden w-full justify-center md:flex/, "search must show on the phone bar");
const homeSrc = readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");
assert.match(homeSrc, /Wear it/);
assert.match(homeSrc, /Drink from it/);
assert.match(homeSrc, /Gift it/);
assert.match(homeSrc, /Bitcoin merch/);
const brandSrc = readFileSync(path.join(process.cwd(), "lib/config.ts"), "utf8");
assert.match(brandSrc, /Chunky Whale/);
assert.doesNotMatch(brandSrc, /STACKHOUSE|StackHouse/);
const logoSrc = readFileSync(path.join(process.cwd(), "components/Logo.tsx"), "utf8");
assert.match(logoSrc, /chunky-whale-logo\.png/);
assert.match(logoSrc, /chunky-whale-dark\.png/);
assert.doesNotMatch(logoSrc, /stackhouse-logo|STACKHOUSE|StackHouse|BitcoinMark/);
const layoutSrc = readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf8");
assert.match(layoutSrc, /chunky-whale-logo\.png/);
assert.match(layoutSrc, /chunky-whale-dark\.png/);
assert.doesNotMatch(layoutSrc, /stackhouse-logo/);
assert.ok(RETIRED_SLUGS.has("bitcoin-daddy-tote"), "bitcoin-daddy-tote stays unpublished");
assert.ok(RETIRED_SLUGS.has("infant-node-onesie"), "onesie stays held");
assert.ok(RETIRED_SLUGS.has("ring-crewneck"), "crew 360s stay held");
const houseTee = getProduct("stackhouse-est-tee");
assert.equal(houseTee?.editionId, "SH-D12-STACKH-T");
assert.equal(houseTee?.image, "/products/chunky-whale-est-tee.png");
const cardSwatch = readFileSync(path.join(process.cwd(), "components/ColorSwatches.tsx"), "utf8");
assert.match(cardSwatch, /max = 3/, "cards must not dump all twelve dots");
const lineStrip = readFileSync(path.join(process.cwd(), "components/LineStrip.tsx"), "utf8");
assert.match(lineStrip, /This line/);
const pdp = readFileSync(path.join(process.cwd(), "components/ProductView.tsx"), "utf8");
assert.match(pdp, /fitNote/);
assert.match(pdp, /Print close-up/);

for (const p of productsIn("whiskey-glasses").concat(productsIn("shot-glasses"), productsIn("coffee-mugs"))) {
  assert.equal(takesColourways(p), false, `${p.slug} glass/mug must not have colour swatches`);
}

const totals = basketTotals(
  [
    { category: "tees", qty: 1, priceGbp: 28 },
    { category: "hoodies", qty: 1, priceGbp: 55 },
  ],
  "GB",
);
assert.ok(totals.itemsGbp === 83, `items ${totals.itemsGbp}`);
assert.ok(totals.shipGbp > 0, "shipping estimate missing");
assert.equal(totals.totalGbp, totals.itemsGbp + totals.shipGbp);

const us = basketTotals([{ category: "tees", qty: 1, priceGbp: 28 }], "US");
const row = basketTotals([{ category: "tees", qty: 1, priceGbp: 28 }], "AE");
assert.ok(row.shipGbp >= us.shipGbp, "rest-of-world should not be cheaper than US");

assert.equal(gbpToPence(totals.totalGbp), Math.round(totals.totalGbp * 100));
assert.equal(penceMatchesGbp(32, 32), false, "32 pence must not confirm a £32 order (100×)");
assert.equal(gbpAmountsMatch(32, 0.32), false);

const PRINT_CLARITY_RETIRED = [
  "so-back-mug",
  "so-over-mug",
  "pow-tweet-mug",
  "fiat-exp-mug",
  "quantum-mug",
  "no-laser-mug",
  "orange-pill-mug",
  "no-forecast-mug",
  "bitcoin-mummy-hat",
  "bitcoin-mummy-mug",
  "bitcoin-daddy-mug",
  "hodl-mug",
  "21m-poster",
  "log-chart-mug",
  "bitcoin-daddy-hat",
  "satoshi-hat",
  "hard-money-hat",
  "btc-dad-hat",
  "keys-tee",
  "log-scale-tee",
  "orange-daily-tee",
  "candles-hoodie",
  "embroidered-b-hoodie",
  "b-zip-hoodie",
];
for (const slug of PRINT_CLARITY_RETIRED) {
  assert.ok(RETIRED_SLUGS.has(slug), `${slug} must stay retired — ₿ off the object or a ghosted mark`);
}

const printFails = auditPrintSources(live);
assert.equal(printFails.length, 0, printFails.map((p) => `${p.slug}:${p.image}`).join(", ") || "print allowlist");
assert.ok(allowedPrintFilenames().has("bitcoin-daddy-tee.png"), "Daddy tee must stay on the tee renderer");
assert.ok(allowedPrintFilenames().has("21m-hat.png"), "21M hat is the one approved studio hat");

const sweatRender = readFileSync(path.join(process.cwd(), "scripts/render-sweat-mockups.mjs"), "utf8");
assert.match(sweatRender, /blankChest/, "sweat mockups must wipe leftover slogan on a blank ghost");
assert.match(sweatRender, /renderApparel/, "sweat mockups must use the high-DPI Inter + ₿ stamp");
assert.match(sweatRender, /b-mark-hoodie\.png/, "₿ Mark Hoodie must be built from the official stamp");
assert.match(sweatRender, /markOnly: true/, "mark-only sweats must stamp the ₿ with no slogan");
assert.doesNotMatch(sweatRender, /43758\.5453/, "do not clone random fabric pixels — that distresses letters");

const studioRender = readFileSync(path.join(process.cwd(), "scripts/lib/studio-render.mjs"), "utf8");
assert.match(studioRender, /sloganPng/, "catalog stamps must render Inter at 4× then downscale");
assert.match(studioRender, /blankChest/, "ghost templates must be wiped smooth, not speckled");
assert.match(studioRender, /Inter-Bold\.ttf/, "Inter must ship in the repo so Macs stamp the same letters");
assert.doesNotMatch(studioRender, /43758\.5453/, "studio render must not sprinkle random fabric noise");
assert.ok(
  statSync(path.join(process.cwd(), "scripts/fonts/Inter-Bold.ttf")).size > 100000,
  "Inter-Bold must ship in the repo so every Mac stamps the same letters",
);
assert.ok(
  statSync(path.join(process.cwd(), "scripts/fonts/JetBrainsMono-Bold.ttf")).size > 80000,
  "JetBrains Mono must ship so Vires / protocol lines stamp the same",
);
assert.match(studioRender, /JetBrainsMono-Bold\.ttf/, "second face is clean mono, not a display/grunge font");
assert.match(studioRender, /Oswald-Bold\.ttf/, "condensed face must be Oswald, not a distressed display font");
assert.match(studioRender, /ArchivoBlack-Regular\.ttf/, "loud face must be Archivo Black — solid, not grunge");
assert.match(studioRender, /renderPolo/, "polo shots come from the polo renderer, not a restamped tee");
assert.ok(statSync(path.join(process.cwd(), "scripts/fonts/Oswald-Bold.ttf")).size > 40000, "Oswald must ship");
assert.ok(statSync(path.join(process.cwd(), "scripts/fonts/ArchivoBlack-Regular.ttf")).size > 40000, "Archivo Black must ship");
assert.ok(statSync(path.join(process.cwd(), "docs/DESIGN-DIRECTION.md")).size > 400, "design direction (inspire, do not copy FOMO21) must stay");
const sayingsSrc = readFileSync(path.join(process.cwd(), "lib/sayings.json"), "utf8");
assert.doesNotMatch(sayingsSrc, /TICK TOCK|FIX THE MONEY|GOING TO ZERO|MELT YOUR FACE|GOT BITCOIN|PARANOID SURVIVE/i, "never print FOMO21 slogans from the sayings list");
assert.ok(statSync(path.join(process.cwd(), "docs/SAYINGS.md")).size > 200, "approved sayings list must stay editable");

assert.equal(defaultColorId(getProduct("no-second-tee")!), "ink", "No Second tee must open on the Ink studio shot");
assert.equal(defaultColorId(getProduct("hodl-tee")!), "ink", "HODL tee must open on Ink, not a smashed recolour");

const markQa = readFileSync(path.join(process.cwd(), "lib/catalog-bitcoin-mark.ts"), "utf8");
assert.match(markQa, /MIN_CLOCKWISE_LEAN/, "catalog QA must measure ₿ lean direction");
assert.doesNotMatch(markQa, /tilt: 14/, "do not treat a square orange blob as already official");
const teeRender = readFileSync(path.join(process.cwd(), "scripts/render-tee-mockups.mjs"), "utf8");
assert.match(teeRender, /bitcoin-daddy-tee\.png/, "Bitcoin Daddy tee must be rebuilt from the official ₿");
assert.match(teeRender, /blankChest/, "tee mockups must start from a blank ghost");
assert.match(teeRender, /THERE IS NO/, "No Second tee must print the full readable line");
const glassRender = readFileSync(path.join(process.cwd(), "scripts/render-glass-mockups.mjs"), "utf8");
assert.match(glassRender, /sloganPng/, "glass mockups must use the high-DPI Inter stamp");
assert.match(
  readFileSync(path.join(process.cwd(), "lib/catalog-audit.ts"), "utf8"),
  /print-clarity/,
  "catalog QA must fail unreadable / distressed type",
);
assert.match(
  readFileSync(path.join(process.cwd(), "scripts/restamp-mark-only.mjs"), "utf8"),
  /garmentMarkPng/,
  "in-place restamp must use the official SVG with a visible clockwise lean",
);

const checkoutSrc = readFileSync(path.join(process.cwd(), "app/api/checkout/route.ts"), "utf8");
assert.match(checkoutSrc, /basketTotals/);
assert.match(checkoutSrc, /guardShopPost/);
assert.match(checkoutSrc, /liveProducts/);
assert.match(checkoutSrc, /isCheckoutCountry/);
assert.match(checkoutSrc, /viewToken/);
assert.match(checkoutSrc, /updateOrder/);
assert.match(checkoutSrc, /p\.limited/);

const opennodeWh = readFileSync(path.join(process.cwd(), "app/api/webhooks/opennode/route.ts"), "utf8");
assert.match(opennodeWh, /confirmPaidOrder/);
assert.match(opennodeWh, /amount missing/);
assert.doesNotMatch(opennodeWh, /order\.totalGbp : undefined/);

const kindSrc = readFileSync(path.join(process.cwd(), "lib/catalog-kind.ts"), "utf8");
assert.doesNotMatch(kindSrc, /from ["']path["']/, "catalog-kind must stay browser-safe");
assert.match(kindSrc, /imageStem/);

assert.ok(statSync(path.join(process.cwd(), "app/error.tsx")).size > 200, "app/error.tsx must recover from crashes");
assert.ok(statSync(path.join(process.cwd(), "app/global-error.tsx")).size > 200, "global-error must recover if the layout dies");

const sitemapSrc = readFileSync(path.join(process.cwd(), "app/sitemap.ts"), "utf8");
assert.match(sitemapSrc, /liveCollectionMeta/, "sitemap must skip empty retired collections");
assert.match(
  readFileSync(path.join(process.cwd(), "scripts/crawl-shop.ts"), "utf8"),
  /liveCollectionMeta/,
  "route crawl must skip empty retired collections",
);
assert.match(
  readFileSync(path.join(process.cwd(), "lib/orders.ts"), "utf8"),
  /getOrderForReceipt/,
  "success page must load a token-gated receipt, not the raw order",
);
assert.match(
  readFileSync(path.join(process.cwd(), "lib/orders.ts"), "utf8"),
  /orders\/\$\{id\}\.json|orderPath/,
  "each order must be its own file so a receipt cannot dump the whole book",
);

const printfulSync = readFileSync(path.join(process.cwd(), "app/api/printful/sync/route.ts"), "utf8");
assert.match(printfulSync, /OPS_SECRET|PRINTFUL_SYNC_SECRET/, "Printful sync must not be a public config probe");

const inboxSrc = readFileSync(path.join(process.cwd(), "lib/inbox.ts"), "utf8");
assert.match(inboxSrc, /newsletter\.jsonl/);
assert.match(inboxSrc, /wholesale\.jsonl/);

const stripeWh = readFileSync(path.join(process.cwd(), "app/api/webhooks/stripe/route.ts"), "utf8");
assert.match(stripeWh, /confirmPaidOrder/);
assert.match(stripeWh, /paidPence/);
assert.doesNotMatch(stripeWh, /ignored:\s*true/);

const BANNED_PUBLIC = /Forged, not printed|Event Plan|MENA booth|Bitcoin MENA|booth restock/i;
function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}
for (const file of [...walk(path.join(process.cwd(), "app")), ...walk(path.join(process.cwd(), "components"))]) {
  const text = readFileSync(file, "utf8");
  assert.ok(!BANNED_PUBLIC.test(text), `public copy mentions booth/event plan: ${path.relative(process.cwd(), file)}`);
}

console.log("qa:storefront ok", {
  live: live.length,
  hoodies: hoodies.length,
  pullovers: pullovers.length,
  mummyDaddy: productsIn("mummy-daddy").length,
  drinkware: productsIn("drinkware").length,
  women: women.length,
  shipGb: totals.shipGbp,
});
