import "server-only";
import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createStripeCheckout(input: {
  orderId: string;
  email: string;
  lineItems: { name: string; amountGbp: number; qty: number }[];
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: { orderId: input.orderId },
    line_items: input.lineItems.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(i.amountGbp * 100),
        product_data: { name: i.name },
      },
    })),
  });
  return { id: session.id, url: session.url };
}
