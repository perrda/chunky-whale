# STACKHOUSE approved sayings

Edit this file when you want a new Bitcoin line on merch — or to retire one.  
The machine list that builds SKUs is `lib/sayings.json`. Keep the two in sync.

**Print lock (do not break):** solid letters, official right-leaning ₿, unique photo per object. Apparel slogan type is **white**. Faces: `inter`, `mono`, `condensed` (Oswald), `serif` (Libre Baskerville), `display` (Archivo Black). Layouts: `stack`, `huge`, `banner`, `crest`. Do not use cream, ice, or Bitcoin-orange for the words. The ₿ stays `#F7931A`. Glass type is dark ink. Never distressed / grunge / FOMO21 parodies. See `docs/DESIGN-DIRECTION.md`. Rebuild with `npm run mockups`, then `npm run qa` must be 0 errors.

**Hats / caps / beanies:** only the 21M dad hat is live. Do not stamp a new line onto an old hat photo. Add hats only after a hat renderer exists.

---

## How to add a saying

1. Add a row under **Live on the shop** below.
2. Add a matching object in `lib/sayings.json` (`id`, `name`, `tee` lines, `shot` short line, `fill: "#FFFFFF"`, `face`, `layout`).
3. Run `npm run mockups` then `npm run qa`.
4. If QA fails, fix the photo or set the SKU aside — do not borrow a neighbour’s image.

## How to remove a saying

1. Delete it from **Live on the shop** and from `lib/sayings.json`.
2. Leave the PNG in `public/products/` or delete it. Do not point another slogan at that file.

---

## Live on the shop — house lines (already shipping)

These stay. They are the strongest Bitcoin merch lines.

1. I AM HODLING
2. STACK SATS / STAY HUMBLE, STACK SATS
3. DON'T TRUST. VERIFY.
4. NOT YOUR KEYS, NOT YOUR COINS
5. BITCOIN FIXES THIS
6. 21 MILLION
7. 1 BTC = 1 BTC
8. THERE IS NO SECOND BEST
9. ORANGE PILL
10. GRADUALLY, THEN SUDDENLY

Plus the rest of the current catalog (HODL / So Back / Hard Money / Genesis / etc.).

## Live on the shop — Drop 12 (new)

11. IN CASE IT CATCHES ON — Satoshi, 2009. Quiet. Giftable.
12. NOTHING STOPS THIS TRAIN — Lyn Alden. The debt machine. Not a price call.
13. WHEN IN DOUBT, ZOOM OUT — bear-market comfort. Chart joke, no target.
14. THIS IS GOOD FOR BITCOIN — the ironic headline reply.
15. SATS ARE THE STANDARD — unit of account.
17. VIRES IN NUMERIS — strength in numbers. Latin, premium.
18. BITCOIN IS HOPE — Mallers energy. Soft enough to gift.
19. I LOST IT IN A BOATING ACCIDENT — privacy joke. Not for infant.
20. INFLATION IS THEFT — serious maxi line. No profit claim.
23. IT'S GOING UP FOREVER, LAURA — inside joke. Not advice. Not a forecast.
24. BUY THE DIP — cycle mood. Same voice as “the dip is the feature.” Not advice.

25. THE HOUSE ALWAYS STACKS — house joke. Not a casino promise.
26. BLOCK ZERO — genesis energy.
27. VERIFY THEN HODL — check, then sit. Not advice.
28. SOUND MONEY LOUD SHIRT — quiet money, loud cotton.
29. STACKHOUSE EST. 2009 — house mark. Not a university parody.

16. HONEY BADGER DON'T CARE — skipped for now (David).

## Polos (₿ only)

No slogans. Stitched official ₿. Crest / center / mini. Formal, nothing flashy.

## Never print (FOMO21 / clones / profit promises)

Do **not** add these to `lib/sayings.json`. Do not stamp them.

- Tick Tock Next Block
- Fix The Money Fix The World
- First Rule Of Bitcoin / Do Not Sell
- Have Fun Staying Poor
- B Sovereign, Vitamin B, Fist Bitcoin, Get Rich Or Die Mining
- Going To Zero Since 2009, Make Money Great Again, Melt Your Face Off
- Only The Paranoid Survive, got bitcoin?, Satoshi Nirvana smiley, MAGA / Barbie / Metallica / Top Gun parodies
- Melting ₿, flag-filled ₿, Banksy girl, Pulp Fiction, Mt. Gox, laser eyes, their “psychopaths” definition

Close energy we already print instead:

- Tick tock → **ONE MORE BLOCK** / **TEN MINUTES** (shot + catalog)
- Fix the money → **BITCOIN FIXES THIS** / **SOUND MONEY**
- Forever up → **NUMBER GO UP** (already live) and **IT'S GOING UP FOREVER, LAURA** as a named joke, not a promise
- Buying dips → **THE DIP IS THE FEATURE** and **BUY THE DIP** as humour, not advice
