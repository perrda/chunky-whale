# STACKHOUSE — notes

**Always work from the latest files.**  
Source of truth: GitHub **`perrda/stackhouse`** branch **`main`**.  
Folder on both Macs: **`~/Projects/stackhouse`**.  
Local URL: **http://127.0.0.1:3001**  
Homepage check: **“Bitcoin tees. Don’t miss the stack.”** + coin ₿ mark + **StackHouse** wordmark. No Event Plan in the header.

If you see **“Forged, not printed.”** you are on the **wrong** shop (`atelier-archive`). Do not develop it. Do not merge it into `main`.

Version **0.7.7** (19 Aug 2026 Drop 09 Mummy & Daddy). Strapline: **Stack sats. Wear ₿.** Guest checkout. Login optional. Public site does not advertise events. Header uses a coin ₿ mark + StackHouse wordmark. Homepage hero is six rotating products. No Blog — old `/blog` links go to the shop.

Drop 09: **Bitcoin Mummy** and **Bitcoin Daddy** — matching tee, hoodie, dad hat, mug, tote, and long sleeve. Unique photo per SKU. Collection: Mummy & Daddy (also under Women / Collections). Not on kids, jewelry, posters, or stickers.

Bags, socks, phone cases, jewelry, and swimwear have colour swatches the same way tees do. Pick a colour and the photo updates. Glassware, mugs, prints, stickers, and pins stay as photographed.

**Catalog photo rule (do not break again):** every live SKU needs its own photo whose writing matches the title. Drop 07 had cloned STRATEGIC RESERVE onto every mug, HARD MONEY onto extra totes, and other slogans onto family/jewelry clones. Fixed: unique mug/tumbler/pint/coaster/tote shots; clones without a real photo are retired. Guard: `npm run qa:catalog` (also runs before production build). If the audit fails, do not ship.

QA pass on `cursor/qa-bugfix-pass-1342`: checkout no longer pretends a missing payment rail is live; OpenNode charges pounds not 100×; NOWPayments and Coinbase webhooks verify correctly; Printful will not submit a fake or zero variant; success page only clears the basket after a demo order or a paid order; cart/checkout wait for saved basket; nav works with keyboard. Still blocked for live money: Printful variant IDs, durable order store, and David’s payment keys.

Drop 08: **Swimwear** — men (board shorts, rash guard, cap), women (bikinis, one-pieces, rash guard, cap), kids (youth shorts / one-piece / rash / cap, toddler swim). Unique photo per SKU. Find it under **Collections → Swimwear** and the Swimwear menu. Sub-links: Men / Women / Kids / Bikinis / Shorts / One-pieces / Rash guards / Caps.

Drop 07: topical Bitcoin lines (We are so back / It’s so over / Strategic reserve / No laser eyes / Proof of work not proof of tweet / Quantum can wait / Fiat is the experiment / Orange pill / Not a forecast / Four year tide). Apparel **and bags** have **12 colours** including royal blue, crimson, forest, olive, burgundy. The photo recolours when the buyer picks a swatch. Aim: 20+ live options in tees, sweatshirts, hats, women, kids, drinkware, bags, swimwear.

## Remind David: sync both Macs

Before new work, and after any GitHub change, run the sync block on **Mac Mini and MacBook Pro**. Copy-paste: [docs/SYNC.md](docs/SYNC.md).

## Devices (19 Aug 2026)

- **Mac Mini** (`DSP-Mac-Mini-M4-Pro`): `~/Projects/stackhouse` — homepage confirmed.
- **MacBook Pro** (`DSP-MacBook`): `~/Projects/stackhouse` — homepage confirmed.
- Mini leftover `orangeforge` / `orangeforge-leftover-do-not-use` is **not** the shop. Do not delete until David says so.
- iPhone / iPad: same Wi‑Fi as the Mac. Open the Terminal **Network** line (`http://192.168.…:3001`). Check portrait **and** landscape. Public URL after Vercel + domain.

## Brand and repo

- Visible name: **STACKHOUSE**. Merchant likely DSP Capital Ventures Ltd.
- Only GitHub repo: **`perrda/stackhouse`**. Old `orangeforge` URL already redirects here. Do **not** delete it on GitHub (that would delete this shop).
- Safety copies: `correct-site` (same as official `main`) and `atelier-archive` (other site).
- Skill: `.cursor/skills/stackhouse-design/` · Rule: `.cursor/rules/stackhouse.mdc`
- Planned inbox: hello@stackhouse.com (domain not bought). Do not commit `.env`.

## How we got here (do not repeat the mix-up)

- Real shop lived on the MacBook (`backup-before-update` → `22524d6`, `e994494`) and was missing from GitHub `main`.
- GitHub briefly had a different atelier site. Saved as `atelier-archive`, then `main` was pointed at the MacBook shop.

## House rules

- Public site does **not** advertise booths or an event plan. `/events` redirects home. Internal MENA notes stay in docs only.
- Mega-nav: Trending, T-Shirts, Sweatshirts, Women, Hats, Kids, Drinkware, Swimwear, Collections (Collections includes Swimwear and Mummy & Daddy). No Blog. Colour swatches on every garment. Hero photos where we have them.
- Homepage hero shows **six** products, shuffled on each visit, drawn from featured / trending, and later from `soldCount` when sales exist. No empty white panel.
- Sync both Macs: `docs/SYNC.md`. Live card/BTC/USDC/USDT still need David’s keys — demo until then.
- Vendor pack: `docs/VENDOR-ONBOARDING.md` + `docs/ARTWORK-SPEC.md`
- Edition IDs: `SH-` prefix. Bitcoin merch. Dry / insider. Full family cuts. Printful first.
- Never copy FOMO21. Never promise profits.
- First booth: Bitcoin MENA, Abu Dhabi, 7–8 Dec 2026.
- Owner is not technical: plain English, copy-paste steps.

Preview: http://127.0.0.1:3001
