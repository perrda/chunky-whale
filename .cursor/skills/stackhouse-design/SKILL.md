---
name: stackhouse-design
description: Chunky Whale Bitcoin merch art direction, copy, colourways, and family size ranges. Use when adding products, generating Grok Imagine prints, writing slogans, building catalog/checkout variants, or continuing the shop.
---

# Chunky Whale design house

David Perry. Project `~/Projects/stackhouse`. GitHub `perrda/stackhouse` until CoS renames it to `perrda/chunky-whale`. X `@Chunky_Whale`. Merchant: DSP Capital Ventures Ltd. Never promise profits. Never commit `.env`. Never copy FOMO21 slogans or artwork.

## Positioning

- Bitcoin merch Bitcoiners actually want. Fun, humorous, and serious. Ghost-mannequin tees on white, like a proper merch grid.
- Visuals **must** include Bitcoin language: the **official ₿** (bitboy 2010), orange `#F7931A`, 21 million, Satoshi, white paper, HODL, stack sats.
- **HARD RULE — official ₿ only.** The mark is the bitboy coin/₿: orange `#F7931A`, white ₿ on the coin, **tilted clockwise (leans right)**. Never a straight-up B. Never a left-leaning B. Never a generic B with two bars pasted through it. Stamp from `public/brand/bitcoin-b.svg` via `garmentMarkPng` (rotate in SVG, then rasterise — never rotate a bitmap). Do not flip the brand files. Do not extract a B from an old mockup. Rebuild slogan tees with `scripts/render-tee-mockups.mjs` (Bitcoin Daddy tee lives there). Sweats: `scripts/render-sweat-mockups.mjs`. `npm run qa:catalog` fails `bitcoin-mark` on Daddy/Mummy/mark-only SKUs if the ₿ is upright or leans left.
- Ember `#E85D04` is the site UI seal. Garment orange is classic Bitcoin orange.
- One joke or one mark per piece. ₿ appears on almost every SKU.

## Banned

FOMO21 copy, parodies, and clones. Full list: `docs/DESIGN-DIRECTION.md` and `docs/SAYINGS.md`. Steal **grid energy** (quiet crest next to huge type). Never their slogans, smiley, formula, melting ₿, flag ₿, or movie/band lockups. No altcoin logos. No profit claims on garments.

**Polos:** official ₿ only, stitched, collar, nothing flashy. No slogans on polos. Men-mostly formal. Renderer: `scripts/render-polo-mockups.mjs`.

## Approved copy (use these; invent more in the same voice)

- I AM HODLING
- STACK SATS
- FEW UNDERSTAND
- BITCOIN FIXES THIS
- 1 BTC = 1 BTC
- 21 MILLION
- DON'T TRUST. VERIFY.
- THERE IS NO SECOND BEST
- HARD MONEY
- SATOSHI WAS HERE
- PEER-TO-PEER ELECTRONIC CASH
- GRADUALLY, THEN SUDDENLY
- NOT YOUR KEYS NOT YOUR COINS
- INFINITE FIAT / FINITE BITCOIN
- RUN YOUR NODE
- NUMBER GO UP
- Stay humble, stack sats
- Low time preference
- Can't print this
- Genesis 03 Jan 2009
- 21 million. That's the joke.
- The dip is the feature.
- Orange. Daily. (family)
- Node in training. (infant)
- Future UTXO. (youth)
- Bitcoin Mummy. (parent)
- Bitcoin Daddy. (parent)
- In case it catches on
- Nothing stops this train
- When in doubt, zoom out
- This is good for Bitcoin
- Sats are the standard
- Vires in numeris
- Bitcoin is hope
- I lost it in a boating accident
- Inflation is theft
- It's going up forever, Laura (joke, not a forecast)
- Buy the dip (cycle mood, not advice)
- The house always stacks
- Block zero
- Verify then HODL
- Sound money, loud shirt
- CHUNKY WHALE Est. 2009

Approved list to edit: `docs/SAYINGS.md` + `lib/sayings.json`. Never add FOMO21 lines from the banned list.

## Product system

- Cuts: unisex, women, youth, toddler, infant.
- Adult sizes: XS–4XL. Youth S–L. Toddler 2T–5T. Infant 3–24 months.
- Colourways: ink, charcoal, heather, bone, navy, royal blue, sky, forest, olive, crimson, burgundy, Bitcoin orange. Picking a swatch recolours the garment or bag in the photo. **The shirt in the picture must be that colour** — Bone is cream, Ink is black, never a dark mottled tint of the source photo. Same 12 colours on tees, sweatshirts, hats, bags, socks, and phone cases. Jewelry: gold / silver / rose gold / ink / orange. Not on glassware, mugs, prints, stickers, or pins.
- Mockups: ghost mannequin **or clean object shot**, **pure white background**, **square 1:1 crop** (not 3:2). **Very high quality** — no grainy grey paper, no speckled studio noise, no lifestyle walls, concrete floors, books, plants, gym props, or dark textured backdrops. Product cards use a white well + **three** colour dots (plus “+N”). The product page shows every colour as labelled swatches. Recolour lives in `lib/recolor-garment.ts`: map cloth to the swatch lightness, keep print and a small ₿, recolour orange garments (do not treat the whole shirt as the mark). White cloth is cloth, not print. Never flood-bleach cream totes.
- Sweatshirts split: **Hoodie** = hood + kangaroo pocket. **Pullover** = crew neck, no hood, no zip, no pocket. **Crew** and **zip** stay their own cuts. Never list a pullover with a hoodie photo (or the reverse). Hoodies and Pullovers each need **20+ unique designs** with matching writing on the photo. Sweatshirts is the parent (all four cuts).
- Storefront UX: header is five links (T-Shirts, Sweatshirts, Hats, Drinkware, Shop). Search sits on the phone bar, not only inside Menu. Phone menu sections stay closed until Show. Same joke across objects is a **line** (`lib/design-line.ts`) — product pages show “This line”; HODL / So Back / 21 million are shoppable collections. Homepage: **Wear it / Drink from it / Gift it**, not a ten-tile type wall. Collection/shop lists sort (featured / price / name). Product cards show the cut and at most three colour dots. Product page: gallery (front + print close-up), fit sentence, zoom, quantity, breadcrumbs, sticky add with price on the phone. Basket/checkout use colour **labels** (Navy, not `navy`) and a shipping estimate. Checkout charges **items + shipping** via `basketTotals()` — never items only. Shop chips call `productsIn()` so Mummy & Daddy / Drinkware / Sweatshirts stay in sync with collection pages.
- Payments stay demo until David’s keys. Webhooks must call `confirmPaidOrder()` (catalog total × qty + shipping). Never mark paid on a missing or wrong amount. Never fulfil a demo order. Browser APIs (checkout, newsletter, wholesale) need an origin check + rate limit. Catalog QA (`lib/catalog-audit.ts` and friends) uses fs/sharp — do not import those from client components; keep `lib/catalog-kind.ts` browser-safe. `/fulfillment` redirects to `/shipping`. Booth / MENA notes stay in docs only.
- Wordmark is **Chunky Whale** (Chunky + orange Whale). Site chrome, titles, and metadata use that name. Header / favicon / og use the circular house marks in `public/brand/mark-{dark,light}-circle-*.png` — same official whale, never a third one. New edition IDs stay `SH-`; legacy `HM-` stay put. Do not replace product ₿ marks with the whale.
- Premium = embroidery/stitch on hats, hoodies, some tees.
- Live categories: tees, **polo shirts** (stitched ₿ only), sweatshirts (hoodie / pullover / crew), women, hats (dad hat), kids (youth), drinkware (whiskey + shot only), premium, longsleeves, mummy-daddy. Swim, bags, jewelry, posters, leftover mugs/totes stay retired until each has a renderer-backed or clean studio photo. Do not advertise booths or an event plan on the public site. Glassware has no colour swatches. Whiskey and shot each need **20+ unique designs** with matching writing on the photo. Drinkware menu order: whiskey and shot first. Parent collection pages show subsection chips — do not hide a range behind hover-only dropdowns.

## How to add a design

**Easy path (new slogan on tee / hoodie / pullover / whiskey / shot):** edit `docs/SAYINGS.md` and `lib/sayings.json`, then `npm run mockups` and `npm run qa`. Do not add FOMO21 lines. Do not stamp hats — only the 21M dad hat is live.

1. Write one Bitcoin line (meme, philosophy, or protocol). Original — not FOMO21.
2. Generate a **ghost-mannequin mockup** on **pure white** (1:1). Same lighting and crop as the rest of the grid. ₿ somewhere on the garment. The writing on the photo **must match the product title**. Never drop in a lifestyle / atmospheric photo.
3. Save mockup to `public/products/` as `{mark}-{kind}.png` (example: `so-back-mug.png`). Optional print to `public/prints/`.
4. Add SKU at the **top** of `lib/products.ts` with `tag: "Meme"` if it is a slogan tee, `colors`, `cut`, `sizes`, `featured` if it should lead the homepage.
5. Family gifts: same ₿, smaller placement, no sarcasm on infant.
6. Run `npm run mockups` if you touched a renderer, then `npm run qa`. It must print `0 error(s)` on catalog (`print-clarity` included), storefront filters, and payment helpers. Do not ship if it fails.

## HARD RULE — unique photos

- **Never** reuse another SKU’s photo for a different slogan. Drop 07 once put STRATEGIC RESERVE on every mug. That is a fireable catalog error.
- Same design on a different object (tee vs mug vs tote) needs its **own** photo of that object with the **same** line.
- If you do not have a unique matching photo, **do not list the SKU**. Set `retired: true` or omit it. Never borrow a neighbour’s image.
- If the only photo is a lifestyle shot (dark wall, props, wooden table), **do not list it** until a white studio mockup exists. The candlestick hoodie once sat on charcoal stone while every neighbour was a ghost mannequin — that is a catalog error.
- `npm run qa:catalog` (also runs before `next build`) fails the build if two live designs share a photo, a mug/tote/pint uses the wrong object, a live photo is not a white studio mockup, a live photo still has an **upright** Bitcoin B, a swatch recolour does not match the garment colour (`color-match`), the studio backdrop is grainy (`grain`), a live photo is not renderer output (`print-source`), or the writing/₿ fails `print-clarity` (distressed crumbs, missing letters, leftover slogan, ₿ off the object, recolour smashed the type).
- **HARD RULE — writing and marks must be readable. No exceptions.** The buyer decides from the photo. Every live shot must show the title line in **solid, complete Inter letters** and a coherent official ₿ **on the object** — not distressed/grunge type, missing strokes, a second ghost slogan (old HODL under the new line), a sticker rectangle, or a ₿ hanging off a mug/hat into the white backdrop. If you cannot read it at card size, or the mark is off the product, **retire the SKU**. Never ship a garbled “I AM HODLING” or a scuffed “NO SECOND BEST”.
- **How stamps are built (do not invent another method).** Live apparel/glass/polo photos must come from `scripts/render-tee-mockups.mjs`, `scripts/render-sweat-mockups.mjs`, `scripts/render-glass-mockups.mjs`, or `scripts/render-polo-mockups.mjs`. Those call `scripts/lib/studio-render.mjs`: (1) wipe the ghost to a **blank** silhouette (`blankChest` — never clone random fabric pixels), (2) stamp official ₿ via `garmentMarkPng` (polos use a stitched offset), (3) stamp type as **SVG paths** from `scripts/fonts/` — Inter, Mono, Oswald, Libre Baskerville, Archivo Black. Layouts: stack / huge / banner / crest. Type fill is white on apparel — never Bitcoin-orange `#F7931A` on the slogan. Never distressed fonts. Never `@font-face` through Sharp. Never lock `hodl-tee-ink.png` as the ghost. The only photo exception is `21m-hat.png`. After SKU or image edits: `npm run mockups` then `npm run qa` (must be 0 errors).
- **First view is the studio shot.** Renderer apparel is **Ink**. `defaultColorId` / `needsRecolor` must open on Ink (or the `imagesByColor` photo) so the first frame is not a smashed recolour. Recolour may change cloth when the buyer picks another swatch — it must never punch holes in letters.

## Agents (run in this order, do not skip)

1. **Copy** — one Bitcoin line, giftable, not a FOMO21 clone.
2. **Mark** — ₿ / Bitcoin B on the garment.
3. **Mockup** — ghost mannequin, white background.
4. **Colourway** — heather and navy first, then ink, then orange if the mark is dark.
5. **Cut** — unisex default; duplicate SKU for women/youth/infant where it gifts well.
