/**
 * Storefront consistency — filters, counts, checkout math, glassware, copy.
 * Run: npm run qa:storefront
 */
import assert from "node:assert/strict";
import { SHOP_FILTERS, SHOP_MORE_FILTERS, MEGA_NAV } from "../lib/nav";
import { liveProducts, productsIn, takesColourways } from "../lib/products";
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

const womenNav = MEGA_NAV.find((n) => n.label === "Women");
assert.ok(womenNav);
assert.ok(
  !womenNav.children?.some((c) => /bikini|one-piece/i.test(c.href)),
  "Women nav still lists swim subsections",
);

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

console.log("qa:storefront ok", {
  live: live.length,
  hoodies: hoodies.length,
  pullovers: pullovers.length,
  mummyDaddy: productsIn("mummy-daddy").length,
  drinkware: productsIn("drinkware").length,
  women: women.length,
  shipGb: totals.shipGbp,
});
