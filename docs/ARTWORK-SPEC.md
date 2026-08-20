# Artwork spec for printers — STACKHOUSE

Give this to Printful / Gelato / Printify designers or upload yourself.

## Files

- Mockups (site photos): `public/products/*.png` — 1:1, **pure white** background, ghost mannequin or clean product shot. No lifestyle scenes. No grainy grey paper. The colour in the photo must match the swatch the customer picked.
- Print files (what gets printed): `public/prints/*.png` — high contrast, ₿ orange `#F7931A` on transparent or black.

## Print rules

1. **Official Bitcoin ₿ only.** Bitboy 2010 mark: orange `#F7931A`, **~14° clockwise tilt**. Never a vertical B. Never a generic “B with two bars.” Source files: `public/brand/bitcoin-b.svg` (orange ₿) and `public/brand/bitcoin-coin.svg` (orange coin, white ₿). `npm run qa:catalog` fails `bitcoin-mark` if a live photo still has an upright B, `color-match` if a swatch does not match the garment, and `grain` if the backdrop is speckled.
2. One joke or one mark. Do not crowd.
3. Never copy FOMO21 slogans or art.
4. No profit claims (“guaranteed 100x”).
5. No altcoin logos.
6. Embroidery (premium): ₿ only, or ₿ + one short word (HODL, 21M, STACK). Max ~5k stitches if the printer caps it.
7. DTG tees: 300 DPI, PNG, at least 4500px on the long edge when we export for Printful.
8. Hats: front-centre embroidery, 2.5" width typical.
9. Mugs: wrap or front ₿ + line.
10. Family/infant: small ₿, no sarcasm.

## Colourways we sell

Ink `#0B0C0E` · Navy `#1B2430` · Charcoal `#3A3D42` · Heather `#6B6E73` · Bone `#EDE6D9` · Bitcoin orange `#F7931A` · Olive (vintage hat).

If the printer does not have the exact blank, nearest navy/black/heather. Tell us before substituting orange blanks.

## How a new design is born

1. Write one Bitcoin line (see `.cursor/skills/stackhouse-design/copy.md`).
2. Generate print-ready 1:1.
3. Generate ghost-mannequin mockup on white.
4. Add SKU in `lib/drop-06.ts` (or products) with `imagesByColor` so the site photo changes with the swatch.
5. Sample from Printful before featuring.

## Naming

Edition IDs: `SH-` prefix (STACKHOUSE).
