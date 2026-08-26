/**
 * Hit every public route. Needs the shop running.
 * npx tsx scripts/crawl-shop.ts http://127.0.0.1:3001
 */
import { liveCollectionMeta, MEGA_NAV } from "../lib/nav";
import { liveProducts } from "../lib/products";

const base = process.argv[2] ?? "http://127.0.0.1:3001";
const extra = [
  "/",
  "/shop",
  "/shop?cat=mummy-daddy",
  "/shop?q=hodl",
  "/cart",
  "/checkout",
  "/checkout/success",
  "/login",
  "/account",
  "/about",
  "/faq",
  "/sizes",
  "/shipping",
  "/fulfillment",
  "/wholesale",
  "/forge",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/events",
  "/blog",
  "/api/status",
  "/sitemap.xml",
  "/robots.txt",
];

async function main() {
  const hrefs = new Set(extra);
  for (const n of MEGA_NAV) {
    hrefs.add(n.href);
    for (const c of n.children ?? []) hrefs.add(c.href);
  }
  for (const c of liveCollectionMeta()) hrefs.add(`/collection/${c.slug}`);
  for (const p of liveProducts()) hrefs.add(`/product/${p.slug}`);

  const bad: { url: string; status: number; body: string }[] = [];
  for (const path of [...hrefs]) {
    const url = path.startsWith("http") ? path : `${base}${path}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status >= 400 && res.status !== 307 && res.status !== 308) {
        const body = (await res.text()).slice(0, 200).replace(/\s+/g, " ");
        bad.push({ url, status: res.status, body });
      }
    } catch (err) {
      bad.push({ url, status: 0, body: String(err) });
    }
  }
  console.log("checked", hrefs.size, "bad", bad.length);
  for (const b of bad) console.log(b.status, b.url, b.body);
  if (bad.length) process.exit(1);
}

main();
