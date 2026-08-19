# Go-live (plain English)

The website is built. It is **not live money** until you finish this list.

Sales are not guaranteed. A good shop can still sell nothing. Ads, events, and product quality decide revenue — not this checklist.

## Must do before first real order

1. Buy domain (**stackhouse.com** or .store / .xyz).
2. Create **Printful**. Order one sample of every SKU to Bangkok. Reject anything that looks cheap. Then paste each size × colour **variant ID** into the catalog — the shop cannot fulfil without those numbers.
3. Create **Stripe** (cards), **OpenNode** (Bitcoin + Lightning), **Coinbase Commerce** (USDC), **NOWPayments** (USDT).
4. Put keys in `.env.local` (copy `.env.example`). Include webhook secrets (`STRIPE_WEBHOOK_SECRET`, `COINBASE_COMMERCE_WEBHOOK_SECRET`, `NOWPAYMENTS_IPN_SECRET`). Never put keys on GitHub.
5. Deploy on **Vercel** from the GitHub repo `perrda/stackhouse`. Orders currently save to a local file — before real sales, move them to a real database or paid orders can vanish when a server restarts.
6. Ask your accountant: UK VAT on merch, who is merchant of record (DSP Capital Ventures Ltd unless you change it).
7. Click through a **£1 test** on each payment method.
8. Apply for Bitcoin MENA exhibitor when sales open.

## Dropship map

See `/fulfillment` on the site and [DROPSHIP.md](./DROPSHIP.md).

Primary: Printful. Scale/local: Gelato. Overflow: Printify, Gooten, SPOD.
