---
name: orangeforge-design
description: ORANGEFORGE Bitcoin merch art direction, copy, colourways, and family size ranges. Use when adding products, generating Grok Imagine prints, writing slogans, building catalog/checkout variants, or continuing the orangeforge store.
---

# ORANGEFORGE design house

David Perry. Project `~/Projects/orangeforge`. Merchant likely DSP Capital Ventures Ltd. Never promise profits. Never commit `.env`. Never copy FOMO21 slogans or artwork.

## Positioning

- House line: **insider / dry** humour a Bitcoiner is proud to gift. Not expo-floor cringe.
- Visuals **must** include Bitcoin language: ₿, the Bitcoin B (two vertical strikes), orange `#F7931A` as a mark, **charts and graphs** (log, candles, hashrate, difficulty stairs, V-shaped dip).
- Ember `#E85D04` remains the site UI seal. Garment orange may be classic Bitcoin orange.
- Cool and fun, still atelier — one joke per piece, one chart per piece. No wall of slogans.

## Banned

FOMO21 copy and clones, including: Going To Zero Since 2009, Make Money Great Again, Melt Your Face Off, Have Fun Staying Poor, Only The Paranoid Survive (as a Bitcoin tee). No US-flag dad-humour dump. No altcoin logos. No profit claims on garments (“guaranteed 100x”).

## Approved copy (use these; invent more in the same voice)

- 21 million. That's the joke.
- The dip is the feature.
- Difficulty adjusts.
- Ten minutes.
- Fixed supply.
- Verify.
- Not your keys.
- Proof of work.
- Log scale.
- Since block one.
- I stayed for the chart.
- The number does not change.
- Orange. Daily. (family / pharmacy-label gag)
- Node in training. (infant)
- Future UTXO. (youth)

## Product system

- Cuts: unisex, women, youth, toddler, infant.
- Adult sizes: XS–4XL. Youth S–L. Toddler 2T–5T. Infant 3–24 months.
- Colourways: ink black, bone, Bitcoin orange, navy, heather.
- Categories: tees, longsleeves, hoodies, hats, home, bags, accessories, events, family.
- Payments (site, not prints): card, BTC+Lightning, USDC, USDT.
- Dropship: Printful first; Gelato scale; Printify/Gooten/SPOD overflow.

## How to add a design

1. Write one dry line **or** one chart. Not both shouting.
2. Generate a **print-ready 1:1** on black or bone, then a **4:3 mockup** on garment.
3. Save print to `public/prints/`, mockup to `public/products/`.
4. Add SKU in `lib/products.ts` with `colors`, `cut`, `sizes`.
5. Family gifts: same mark, smaller placement, no sarcasm on infant.

## Agents (run in this order, do not skip)

1. **Copy** — one line, dry, giftable.
2. **Chart** — if the piece is a graph, keep axes implied, not a Bloomberg screenshot.
3. **Print** — Grok Imagine, high contrast, print-safe.
4. **Colourway** — black first, then bone, then orange if the mark is dark.
5. **Cut** — unisex default; duplicate SKU for women/youth/infant where it gifts well.
