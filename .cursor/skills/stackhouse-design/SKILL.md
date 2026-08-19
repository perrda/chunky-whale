---
name: stackhouse-design
description: STACKHOUSE Bitcoin merch art direction, copy, colourways, and family size ranges. Use when adding products, generating Grok Imagine prints, writing slogans, building catalog/checkout variants, or continuing the stackhouse store.
---

# STACKHOUSE design house

David Perry. Project `~/Projects/stackhouse`. GitHub `perrda/stackhouse`. Merchant likely DSP Capital Ventures Ltd. Never promise profits. Never commit `.env`. Never copy FOMO21 slogans or artwork.

## Positioning

- Bitcoin merch Bitcoiners actually want. Fun, humorous, and serious. Ghost-mannequin tees on white, like a proper merch grid.
- Visuals **must** include Bitcoin language: ₿ / Bitcoin B, orange `#F7931A`, 21 million, Satoshi, white paper, HODL, stack sats.
- Ember `#E85D04` is the site UI seal. Garment orange is classic Bitcoin orange.
- One joke or one mark per piece. ₿ appears on almost every SKU.

## Banned

FOMO21 copy and clones, including: First Rule Of Bitcoin / Do Not Sell, B Sovereign, All Your Models Are Destroyed, Vitamin B, Tick Tock Next Block, Fix The Money Fix The World, Fist Bitcoin, Get Rich Or Die Mining, Going To Zero Since 2009, Make Money Great Again, Melt Your Face Off, Have Fun Staying Poor, Only The Paranoid Survive (as a Bitcoin tee). No altcoin logos. No profit claims on garments.

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

## Product system

- Cuts: unisex, women, youth, toddler, infant.
- Adult sizes: XS–4XL. Youth S–L. Toddler 2T–5T. Infant 3–24 months.
- Colourways: ink, charcoal, heather, bone, navy, royal blue, sky, forest, olive, crimson, burgundy, Bitcoin orange. Picking a swatch recolours the garment or bag in the photo. Same 12 colours on tees, sweatshirts, hats, bags, socks, and phone cases. Jewelry: gold / silver / rose gold / ink / orange. Not on glassware, mugs, prints, stickers, or pins.
- Mockups: ghost mannequin, white background, square crop. Product cards use a white well + colour swatches that **change the photo** (`imagesByColor`).
- Premium = embroidery/stitch on hats, hoodies, some tees.
- Categories: tees, sweatshirts, women, hats, kids, drinkware, swimwear (shorts, bikinis, one-pieces, rash guards, swim caps), jewelry, posters, stickers, bags, premium. Do not advertise booths or an event plan on the public site. Same 12 colours on swimwear.

## How to add a design

1. Write one Bitcoin line (meme, philosophy, or protocol). Original — not FOMO21.
2. Generate a **ghost-mannequin mockup** on white (1:1), ₿ somewhere on the garment. The writing on the photo **must match the product title**.
3. Save mockup to `public/products/` as `{mark}-{kind}.png` (example: `so-back-mug.png`). Optional print to `public/prints/`.
4. Add SKU at the **top** of `lib/products.ts` with `tag: "Meme"` if it is a slogan tee, `colors`, `cut`, `sizes`, `featured` if it should lead the homepage.
5. Family gifts: same ₿, smaller placement, no sarcasm on infant.
6. Run `npm run qa:catalog`. It must print `0 error(s)`. Do not ship if it fails.

## HARD RULE — unique photos

- **Never** reuse another SKU’s photo for a different slogan. Drop 07 once put STRATEGIC RESERVE on every mug. That is a fireable catalog error.
- Same design on a different object (tee vs mug vs tote) needs its **own** photo of that object with the **same** line.
- If you do not have a unique matching photo, **do not list the SKU**. Set `retired: true` or omit it. Never borrow a neighbour’s image.
- `npm run qa:catalog` (also runs before `next build`) fails the build if two live designs share a photo or a mug/tote/pint uses the wrong object.

## Agents (run in this order, do not skip)

1. **Copy** — one Bitcoin line, giftable, not a FOMO21 clone.
2. **Mark** — ₿ / Bitcoin B on the garment.
3. **Mockup** — ghost mannequin, white background.
4. **Colourway** — heather and navy first, then ink, then orange if the mark is dark.
5. **Cut** — unisex default; duplicate SKU for women/youth/infant where it gifts well.
