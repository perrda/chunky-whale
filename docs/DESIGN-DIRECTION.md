# STACKHOUSE design direction

David, 22 Aug 2026. Iterate from here. Do not copy FOMO21.

## What we take from other merch shops (energy only)

FOMO21 (and shops like it) sells because the **grid is varied**: quiet crest marks next to huge type, black next to orange, a joke next to a serious line, a dinner polo next to a loud hoodie.

We steal that **energy**. We do **not** steal their slogans, parodies, or art.

## Never copy (from the screenshots and their site)

Do not stamp, redraw, or “almost” these:

- Bitcoin Red Team / Ghostbusters squad
- Only The Paranoid Survive
- Going To Zero Since 2009 (chart + slogan)
- I Like Bitcoin And Maybe 3 People
- Satoshi Nirvana smiley
- Bitcoin / Jesus save your money
- Make Money Great Again
- Barbie-script “Bitcoin”
- Metallica-style BITCOIN
- Top Gun wings
- Melt Your Face Off / melting ₿ / galaxy ₿ / pop-art melt
- American-flag filled ₿
- Japanese サトシ + FOMO21 lockup
- Bitcoin supply summation formula as their graphic
- “got bitcoin?”
- Banksy balloon girl
- Pulp Fiction “say crypto”
- Mt. Gox logo
- Trump “orange man”
- Laser eyes (human or cat)
- Their dictionary “psychopaths” line
- Tick Tock Next Block, Fix The Money Fix The World, HFSP, and the rest of `docs/SAYINGS.md` banned list

If a buyer could think we bought it from them, it is a clone. Invent a new joke.

## What STACKHOUSE does instead

- **Official clockwise ₿** on almost every piece. Orange `#F7931A`.
- **Readable type.** Solid letters as SVG paths. Faces we allow: Inter, JetBrains Mono, Oswald (condensed), Libre Baskerville (serif), Archivo Black (display). No distressed, grunge, ransom, or brush script that smashes at card size.
- **Layouts:** centred stack, huge type, banner underline, left-chest crest, mark-only quiet.
- **Polos:** ₿ only, stitched look, collar, nothing flashy. Formal for men mostly. No slogans on polos.
- **Copy:** house jokes (`docs/SAYINGS.md`). Laura / buy the dip are jokes, not forecasts.
- **Photos:** unique 1:1 white studio per slogan **and** object. Rebuild with `npm run mockups`.

## How to add variety next time

1. New line in `docs/SAYINGS.md` + `lib/sayings.json` (`face`, `layout`).
2. Or a new quiet ₿ placement (crest / mini / center) — polo or tee.
3. `npm run mockups` then `npm run qa` (0 errors).
4. Do not revive hats, mugs, buckets, or beanies until that object has its own renderer.

More FOMO21 screenshots are useful later for **energy** (colour play, grid mix). They are never a brief to clone a SKU.
