# Accounts you need to create

I cannot log into these for you. Do them in this order. After each one, put the key into a file named `.env.local` in this project (copy from `.env.example`). Never email keys. Never put them on GitHub.

## 1. Domain

1. Go to a registrar (Namecheap, Cloudflare, or Google Domains).
2. Wait until David picks a domain. Do not invent or buy one from this file.
3. Buy it. Later we point it at Vercel.

## 2. Vercel (puts the site on the internet)

1. Open https://vercel.com and sign in with GitHub.
2. Import the GitHub repo (`perrda/stackhouse` until CoS renames it to `perrda/chunky-whale`).
3. Add the same keys from `.env.example` in Vercel → Settings → Environment Variables.

## 3. Printful (prints and ships)

1. Open https://www.printful.com and create an account.
2. Business: DSP Capital Ventures Ltd (or the entity your accountant confirms).
3. Dashboard → Stores → add a **Manual order / API** store.
4. Settings → API → create a token.
5. Paste into `PRINTFUL_API_KEY`.
6. Order **one sample of each SKU to your Bangkok address** before you sell.
7. In Printful, copy each garment’s **variant ID** (size × colour) into the catalog (`printful.variants` on the product). Without those numbers the shop will take payment but will not place the print job.

Printful does not have a UAE factory. For the MENA booth, place a **bulk order around 16 October 2026** and ship to your Abu Dhabi hotel or a freight forwarder. Confirm the hotel accepts parcels.

## 4. Shopify (optional but planned)

Used as the invisible product/tax backend. The public site is our custom design, not a Shopify theme.

1. Open https://www.shopify.com and start a store named Chunky Whale
2. Settings → Apps → Develop apps → Storefront API token.
3. Paste `SHOPIFY_STORE_DOMAIN` (the `.myshopify.com` host Shopify gives you) and `SHOPIFY_STOREFRONT_TOKEN`.
4. Connect the Printful Shopify app when you are ready, **or** keep Printful API-only.

Until this exists, the site uses the built-in catalog (hundreds of SKUs). Printful still needs a **variant ID for each size × colour** or paid orders cannot be sent to print.

## 5. Stripe (cards)

1. Open https://dashboard.stripe.com and register the UK company.
2. Activate GBP.
3. Developers → API keys → Secret key → `STRIPE_SECRET_KEY`.
4. Developers → Webhooks → endpoint `https://YOURDOMAIN/api/webhooks/stripe` → event `checkout.session.completed` → `STRIPE_WEBHOOK_SECRET`.
5. For the booth: Stripe Tap to Pay on iPhone.

## 6. OpenNode (Bitcoin + Lightning)

Default Bitcoin provider so you do not have to host BTCPay.

1. Open https://www.opennode.com and create an account.
2. Complete business checks (this can take days — start early).
3. API keys → `OPENNODE_API_KEY`.
4. Webhooks → `https://YOURDOMAIN/api/webhooks/opennode`.
5. Fund a small Lightning float before MENA. Test one payment on your phone.

If OpenNode onboarding is slow, BTCPay Server remains a fallback (self-host). Do not block the website on that.

## 7. Coinbase Commerce (USDC)

1. Open https://commerce.coinbase.com
2. Create a merchant account.
3. Settings → API keys → `COINBASE_COMMERCE_API_KEY`.
4. Webhook → `https://YOURDOMAIN/api/webhooks/coinbase` for `charge:confirmed` → shared secret goes in `COINBASE_COMMERCE_WEBHOOK_SECRET`.

## 7b. NOWPayments (USDT)

1. Open https://nowpayments.io and create a business account.
2. API keys → `NOWPAYMENTS_API_KEY`.
3. IPN secret → `NOWPAYMENTS_IPN_SECRET`.
4. Webhook / IPN → `https://YOURDOMAIN/api/webhooks/nowpayments`.
5. Enable USDT (TRC-20 is the default in our checkout). Test a $1 invoice.

## 8. xAI / Grok (The Forge, phase 2)

1. Open https://console.x.ai
2. Create an API key → `XAI_API_KEY`.
3. Do this after MENA unless you want to generate more SKUs sooner.

## 9. Bitcoin MENA exhibitor

1. Open the official Bitcoin MENA / ADNEC exhibitor page when sales are open.
2. Apply as Chunky Whale / DSP Capital Ventures Ltd.
3. I will not guess the fee. Pay only the organiser’s invoice.
4. Ask them about power, Wi-Fi, and parcel receiving.

## After keys exist

Tell me “keys are in `.env.local`”. I will switch the shop from demo checkout to live checkout and map Printful variant IDs.
