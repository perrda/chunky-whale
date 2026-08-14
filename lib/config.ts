export const site = {
  name: "STACKHOUSE",
  tagline: "Forged, not printed.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000",
  email: "STACKHOUSE inbox coming", // TODO: Set up contact email
  merchant: "DSP Capital Ventures Ltd",
  merchantNote:
    "UK company (CH 17065288). Merchant of record unless you later appoint another entity.",
  twitter: "https://x.com/stackhouse", // TODO: Update social handles
};

export function paymentsReady() {
  return {
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    opennode: Boolean(process.env.OPENNODE_API_KEY),
    coinbase: Boolean(process.env.COINBASE_COMMERCE_API_KEY),
    nowpayments: Boolean(process.env.NOWPAYMENTS_API_KEY),
    shopify: Boolean(
      process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN,
    ),
    printful: Boolean(process.env.PRINTFUL_API_KEY),
    demo: !(
      process.env.STRIPE_SECRET_KEY ||
      process.env.OPENNODE_API_KEY ||
      process.env.COINBASE_COMMERCE_API_KEY ||
      process.env.NOWPAYMENTS_API_KEY
    ),
  };
}
