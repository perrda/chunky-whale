# STACKHOUSE — notes

**Always work from the latest files.**  
Source of truth: GitHub **`perrda/stackhouse`** branch **`main`**.  
Folder on both Macs: **`~/Projects/stackhouse`**.  
Local URL: **http://127.0.0.1:3001**  
Homepage check: **“Bitcoin merch. Don’t miss the stack.”** + three doors (Wear it / Drink from it / Gift it) + coin ₿ mark + **StackHouse** wordmark. No Event Plan in the header.

If you see **“Forged, not printed.”** you are on the **wrong** shop (`atelier-archive`). Do not develop it. Do not merge it into `main`.

Version **0.7.23** (20 Aug 2026 five UX doors). Strapline: **Stack sats. Wear ₿.** Login optional. Public site does not advertise events. Header uses a coin ₿ mark + **StackHouse** wordmark (Stack + orange House). All-caps **STACKHOUSE** is the legal/meta name — do not “fix” the wordmark to one word. Homepage hero is six rotating products. No Blog — old `/blog` links go to the shop. `/fulfillment` redirects to Shipping (booth freight is not a public page).

**Do not retrace (every past catalog / UX fire):**
- Swatch colour must match the garment in the photo. Bone = cream, never a tinted black tee.
- Official tilted ₿ only. Never a vertical B. Never extract a B from an old mockup.
- Unique photo per slogan **and** object. Never clone a mug/tote/tee photo onto another SKU.
- Square 1:1 white studio only. No lifestyle walls. No grainy grey paper. Do not flood-bleach cream totes or white mugs.
- Hoodie ≠ pullover. Swim subsections live under Swimwear only — not under Women.
- Shop filters must use `productsIn()` (Mummy & Daddy is a slug prefix, not a category). Drinkware includes every mug, including leftovers that once sat in `home`.
- Checkout **must charge items + shipping**. The page already showed the estimate; the API used to drop it. Use `basketTotals()`.
- Demo checkout must still work if `/api/status` fails. Never claim live card/BTC/USDC/USDT in metadata while keys are missing.
- Public pages do not mention the MENA booth. Internal docs only.
- Glass, mugs, prints, stickers, pins: no colour swatches.
- New edition IDs are `SH-`. Old `HM-` IDs stay (printed on those pieces) — do not mass-rename.
- After every merge: Control+C, `rm -rf .next`, SYNC. `npm run qa` must be 0 errors (`qa:catalog` + `qa:storefront` + `qa:payments`).
- A blank white **Internal Server Error** after clicking around is the Next default crash page. Recolour now runs at display size (not 1500px canvases), catalog helpers do not import Node `path` on the client, and `app/error.tsx` shows a STACKHOUSE retry instead of a blank page. Still SYNC if it happens.
- Webhooks must match the paid amount to `basketTotals()` (items + shipping). Missing amount, wrong amount, or a demo order = do not mark paid, do not send to Printful. Checkout / newsletter / wholesale must come from the shop origin and are rate-limited. Do not import `lib/catalog-audit.ts` (or color/grain/studio/bitcoin-mark) into a client component — those use fs/sharp. `/fulfillment` is not a public ops page.
- Writing on the photo must be readable. Official ₿ must be a clean mark, fully on the object — never hanging off a mug or hat into the white backdrop. Never stamp a slogan on a flat chest rectangle, and never leave a ghost of the old line (HODL / 21 MILLION) under the new one. Recolour must not smash letters. If you cannot read the title at card size, or the ₿ is off the product, **retire the SKU**. Do not paint a new ₿ onto an existing white-mug photo (that makes a sticker box). Hoodie/pullover restamp: `node scripts/render-sweat-mockups.mjs`.

**Colour must match the photo.** Picking Bone on Genesis used to leave the black tee looking mottled olive — the old tint kept the dark pixels. Recolour now maps the cloth to the swatch (Bone = cream, Ink = black) on every garment, bag, hat, and swim piece. White tees recolour to dark colours; orange tees/caps recolour too (the whole shirt is not treated as the ₿). Grainy grey studio paper on dark garments was bleached to pure white. `npm run qa:catalog` fails `color-match` and `grain`. Do not flood-bleach cream totes or white mugs. After merge: Control+C, `rm -rf .next`, SYNC. Check http://127.0.0.1:3001/product/genesis-2009-tee — Bone must be cream.

**HARD RULE — official Bitcoin ₿ on every product photo.** The upright “B with bars” on hoodies, tees, hats, glass, and prints was wrong. Use only the bitboy 2010 mark: `#F7931A`, **~14° clockwise**. Files: `public/brand/bitcoin-b.svg` and `public/brand/bitcoin-coin.svg`. Header `Logo.tsx` uses the same ₿ path. Render scripts must stamp that SVG — never copy a B off an old pullover. After new mockups: `npm run marks:fix` then `npm run qa:catalog` (fails `bitcoin-mark` if a live photo is still upright). Do not ship a vertical B again.

**Drinkware:** Drop 11 added **20 whiskey glasses** and **20 shot glasses**. They live on `/collection/whiskey-glasses` and `/collection/shot-glasses`. Clicking Drinkware used to dump a mixed pile with no subsection buttons — Whiskey / Shot only appeared if you hovered the ▾ menu (and Whiskey was last). Fixed: those two sit first under Drinkware, and parent collection pages show chips so you do not need the dropdown. No colour swatches on glass. After a GitHub merge, stop the old `next` process and `rm -rf .next` or the Mac still serves yesterday’s menu.

**UX pass:** phone menu no longer draws an empty second bar; sections stay closed until you tap Show. Header search suggests products as you type. Collections and the shop can sort (featured / price / name) and search the list. Product page: one colour picker, tap-to-zoom, quantity, breadcrumbs, View basket after add, related pieces from the same mark. Cards show the cut (Hoodie / Pullover / Tee). Basket and checkout show colour names, photos, and a shipping estimate in the total.

**Hoodies vs Pullovers:** they used to look like the same grid because Pullovers included every hoodie. Fixed. **Hoodies** = hood + pocket (20 unique designs). **Pullovers** = crew neck, no hood, no zip (20 unique designs). Sweatshirts is the parent of hoodie / pullover / crew / zip. Never reuse a hoodie photo on a pullover listing.

No thin top bar listing payment rails or print regions. How you pay is only at checkout. Print hubs stay on the shipping page, not in the header.

**Catalog photo style (do not break):** every live SKU is a **square 1:1 ghost-mannequin / object shot on pure white**. A 3:2 landscape file looks like a dark band in the grid even if the backdrop is white — the candlestick hoodie failed that way. Colour dots: **two centred rows of six**. `npm run qa:catalog` fails `studio-background` if a live photo is not a white square studio mockup. New products must ship with a white 1:1 mockup or stay unlisted. MENA 2026 tee is retired (old OrangeForge lifestyle shot + public site does not advertise events).

The homepage left copy block and the thin top bar were painted black (`#111` / white type), so they stayed “dark mode” when the rest of the shop was light. They now use the same theme colours as the header (`ink` / `paper` / `surface`). Light mode: pale background, dark type. Dark mode: dark background, cream type. Product photos stay on a white well in both modes.

Drop 07 had cloned tee photos onto hats, hoodies, women’s cuts, long sleeves, and posters (e.g. Fiat Experiment Vintage hat showed a navy t-shirt). Those listings are **retired** until each has its own matching photo. Real hat/hoodie/poster shots stay live. Guard: `npm run qa:catalog` now fails if a live SKU’s photo filename is the wrong object.

Drop 09: **Bitcoin Mummy** and **Bitcoin Daddy** — matching tee, hoodie, dad hat, mug, tote, and long sleeve. Unique photo per SKU. Collection: Mummy & Daddy (also under Women / Collections). Not on kids, jewelry, posters, or stickers.

Bags, socks, phone cases, jewelry, and swimwear have colour swatches the same way tees do. Pick a colour and the photo updates. Glassware, mugs, prints, stickers, and pins stay as photographed.

**Catalog photo rule (do not break again):** every live SKU needs its own photo whose writing matches the title. Drop 07 had cloned STRATEGIC RESERVE onto every mug, HARD MONEY onto extra totes, and other slogans onto family/jewelry clones. Fixed: unique mug/tumbler/pint/coaster/tote shots; clones without a real photo are retired. Guard: `npm run qa:catalog` (also runs before production build). If the audit fails, do not ship.

QA pass on `cursor/qa-bugfix-pass-1342`: checkout no longer pretends a missing payment rail is live; OpenNode charges pounds not 100×; NOWPayments and Coinbase webhooks verify correctly; Printful will not submit a fake or zero variant; success page only clears the basket after a demo order or a paid order; cart/checkout wait for saved basket; nav works with keyboard. Still blocked for live money: Printful variant IDs, durable order store, and David’s payment keys.

Harden pass **0.7.20**: webhooks now refuse a missing or wrong amount and will not mark a demo order paid. Checkout, newsletter, and wholesale only accept requests from the shop (plus LAN while developing). `/fulfillment` no longer publishes booth freight. Catalog QA files stay off the client. Payments are still demo. Full route crawl: `npx tsx scripts/crawl-shop.ts` (shop must be running) — last run 282 routes, 0 errors.

Print clarity **0.7.21**: HODL pullover (and the other restamped hoodies/pullovers) had a flat chest box and leftover type. Recolour then smashed “I AM HODLING”. Fixed: clone real fabric, wipe the old line, stamp Inter + official ₿. First view uses the photographed colour so the letters are not recoloured on load. Do not paint a rectangle on the chest again.

Print clarity **0.7.22** (whole shop): Drop-07 white mugs had a ₿ hanging off the cup. Mummy hat had a second ₿ clipped off the brim. HODL / Mummy / Daddy mugs and the 21M poster had a ghosted mark. Those SKUs are **retired** until David has a clean unique studio shot. Daddy hoodie was restamped from the hoodie ghost template (readable BITCOIN DADDY + official ₿). Do not stamp a new ₿ onto a live white-mug photo — that paints a sticker box. Glass, tees, restamped sweats, totes, and swim that already read clean stay live.

UX five-pass **0.7.23**: shop the joke (This line + HODL / So Back / 21 million collections), five-link header with search on the phone bar, product page gallery + fit line + sticky add with price, homepage three doors (Wear / Drink / Gift) instead of ten type tiles, cards show three colour dots not twelve. Header is T-Shirts / Sweatshirts / Hats / Drinkware / Shop. Women, Kids, Swimwear live under Shop. Swim chips stay on the Swimwear page only.

Drop 08: **Swimwear** — men (board shorts, rash guard, cap), women (bikinis, one-pieces, rash guard, cap), kids (youth shorts / one-piece / rash / cap, toddler swim). Unique photo per SKU. Top nav: **Swimwear** sits left of Drinkware. Swim subsections live only under Swimwear (Men / Women / Kids / Bikinis / Shorts / One-pieces / Rash guards / Caps). Collections keeps a single Swimwear link — no swim sub-links there.

Drop 10: filled Hoodies and Pullovers to **20 unique designs each** (own photo, own line). So Back / So Over / Not a Forecast hoodies and No Laser / Orange Pill pullovers are live again with real sweat shots, not tee clones.

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
- Mega-nav: Trending, T-Shirts, Sweatshirts, Women, Hats, Kids, Swimwear, Drinkware, Collections (Collections includes one Swimwear link plus Mummy & Daddy). No Blog. No payment/print-region promo strip above the header. Colour swatches on every garment. Hero photos where we have them.
- Homepage hero shows **six** products, shuffled on each visit, drawn from featured / trending, and later from `soldCount` when sales exist. No empty white panel.
- Sync both Macs: `docs/SYNC.md`. Live card/BTC/USDC/USDT still need David’s keys — demo until then.
- Vendor pack: `docs/VENDOR-ONBOARDING.md` + `docs/ARTWORK-SPEC.md`
- Edition IDs: `SH-` prefix. Bitcoin merch. Dry / insider. Full family cuts. Printful first.
- Never copy FOMO21. Never promise profits.
- First booth: Bitcoin MENA, Abu Dhabi, 7–8 Dec 2026.
- Owner is not technical: plain English, copy-paste steps.

Preview: http://127.0.0.1:3001
