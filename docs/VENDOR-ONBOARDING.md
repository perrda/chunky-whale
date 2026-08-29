# Vendor onboarding pack — Chunky Whale

Plain English for David. Give this to Printful, Gelato, and Printify when you open accounts. Merchant: **DSP Capital Ventures Ltd (CH 17065288)**. Brand: **Chunky Whale**. Site: to be your domain; today local preview http://127.0.0.1:3001

Never put API keys in email. Never commit `.env`.

## What we sell

Bitcoin-only merch. No altcoins. Ghost-mannequin photos, ₿ on almost every piece. Categories: t-shirts, sweatshirts (hoodie / crew / zip / pullover), women (v-neck / tank / crop), hats (dad, beanie, bucket, distressed, flexfit, snapback, trucker, vintage), kids (youth / toddler / infant), drinkware (mugs, whiskey glasses, shot glasses, tumblers, pints, coasters), jewelry, posters, stickers, bags.

Payments the customer sees: card (Stripe), Bitcoin + Lightning (OpenNode), USDC (Coinbase Commerce), USDT (NOWPayments). You (the printer) get paid by us in the usual Printful/Gelato invoice — not in sats.

## Who does what

| Company | Role | Use for |
| --- | --- | --- |
| **Printful** | Primary | Tees, hoodies, hats, embroidery, mugs, posters, most apparel. Hubs in US, EU, UK, partners JP/AU. |
| **Gelato** | Local scale | Same SKUs when a country is slow on Printful. 30+ countries. |
| **Printify** | Overflow + jewelry | Pendants, some socks/drinkware Printful lacks. |

Customer address → nearest hub → print → ship. We do not hold stock except the MENA booth freight (order ~16 Oct 2026).

## Account setup (copy-paste)

### Printful
1. https://www.printful.com — business: DSP Capital Ventures Ltd.
2. Stores → add **API / Manual order** store named Chunky Whale.
3. Settings → API → token → paste `PRINTFUL_API_KEY` in `.env.local` (never GitHub).
4. Upload prints from `public/prints/` and mockups from `public/products/` using [ARTWORK-SPEC.md](./ARTWORK-SPEC.md).
5. Order **one sample of each SKU to Bangkok** before you sell.

### Gelato
1. https://www.gelato.com — same legal entity.
2. Connect API when Printful is live. Use Gelato for countries Printful quotes slowly.

### Printify
1. https://printify.com — jewelry + overflow.
2. Pick one jewelry maker with samples. Reject cheap plating.

## Order flow (when live)

1. Customer pays on Chunky Whale (guest or account).
2. Our `/api/checkout` + webhooks mark the order paid.
3. We POST the order to Printful (primary) with size, colour, address.
4. If Printful cannot fulfil that region, Gelato.
5. Customer gets tracking by email.

Until keys exist, checkout is **demo** and does not take money.

## Regions and expected times (Printful published averages)

Fulfil 2–5 business days, then transit: US 5–9, UK 6–13, EU 5–12, Asia 7–19, rest of world (UAE/MENA) 12–25 business days door to door. Embroidery sits at the long end of fulfil.

## Brand contacts for the printers

- Brand: Chunky Whale
- Legal: DSP Capital Ventures Ltd, UK CH 17065288
- Email: hello@stackhouse.com (do not invent a new inbox; change when domain is live)
- Owner: David Perry
- First event freight: Bitcoin MENA, ADNEC, Abu Dhabi, 7–8 Dec 2026

## What to send them in the first email

Subject: Chunky Whale — print-on-demand store setup (DSP Capital Ventures Ltd)

Body: We are a Bitcoin merch brand. We need an API store, embroidery on hats/hoodies, DTG tees, mugs, posters. Legal entity DSP Capital Ventures Ltd. Samples to [Bangkok address]. We will connect Stripe/OpenNode ourselves. Please confirm hubs that can print our SKUs and current fulfil times.

Attach: this file + ARTWORK-SPEC.md + 3 sample mockups (HODL tee, stitched ₿ hat, 21M hoodie).
