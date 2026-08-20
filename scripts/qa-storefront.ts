/**
 * Storefront consistency — filters, counts, checkout math, glassware, copy.
 * Run: npm run qa:storefront
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { SHOP_FILTERS, SHOP_MORE_FILTERS, MEGA_NAV } from "../lib/nav";
import { gbpAmountsMatch, gbpToPence, penceMatchesGbp } from "../lib/payments/amount";
import { liveProducts, productsIn, RETIRED_SLUGS, takesColourways } from "../lib/products";
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
assert.ok(
  productsIn("drinkware").some((p) => p.slug === "log-chart-mug"),
  "log-chart-mug missing from Drinkware",
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
assert.ok(shopNav.children?.some((c) => c.href === "/collection/swimwear"), "Shop must still reach Swimwear");
assert.ok(
  !shopNav.children?.some((c) => /bikini|one-piece/i.test(c.href)),
  "Shop dropdown still lists swim subsections",
);
assert.ok(productsIn("hodl").length >= 2, "HODL line too thin");
assert.ok(productsIn("so-back").length >= 2, "So Back line too thin");
assert.ok(productsIn("21-million").length >= 2, "21 million line too thin");
assert.ok(productsIn("wear").length > 20, "Wear it door empty");

const searchSrc = readFileSync(path.join(process.cwd(), "components/SearchBox.tsx"), "utf8");
assert.doesNotMatch(searchSrc, /hidden w-full justify-center md:flex/, "search must show on the phone bar");
const homeSrc = readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");
assert.match(homeSrc, /Wear it/);
assert.match(homeSrc, /Drink from it/);
assert.match(homeSrc, /Gift it/);
assert.match(homeSrc, /Bitcoin merch/);
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
];
for (const slug of PRINT_CLARITY_RETIRED) {
  assert.ok(RETIRED_SLUGS.has(slug), `${slug} must stay retired — ₿ off the object or a ghosted mark`);
}

const sweatRender = readFileSync(path.join(process.cwd(), "scripts/render-sweat-mockups.mjs"), "utf8");
assert.match(sweatRender, /fabricPool/, "sweat mockups must clone fabric, not a flat chest box");
assert.match(sweatRender, /eraseOldPrint/, "sweat mockups must wipe leftover slogan before restamping");
assert.match(sweatRender, /officialMarkPng/, "sweat mockups must stamp the official ₿");
assert.doesNotMatch(sweatRender, /data\[o\] = sr/, "do not paint a single-colour chest rectangle");

const checkoutSrc = readFileSync(path.join(process.cwd(), "app/api/checkout/route.ts"), "utf8");
assert.match(checkoutSrc, /basketTotals/);
assert.match(checkoutSrc, /guardShopPost/);
assert.match(checkoutSrc, /liveProducts/);

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
