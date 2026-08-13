import { NextResponse } from "next/server";
import { getOrder, markPaid } from "@/lib/orders";
import { createPrintfulOrder } from "@/lib/printful";
import { getProduct } from "@/lib/products";
import { getStripe } from "@/lib/payments/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  if (!stripe || !secret) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string }; id: string };
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await markPaid(orderId, session.id);
      if (order) {
        await fulfill(order.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfill(orderId: string) {
  const order = await getOrder(orderId);
  if (!order) return;
  await createPrintfulOrder({
    externalId: order.id,
    recipient: {
      name: order.name,
      address1: order.address1,
      city: order.city,
      country_code: order.country,
      zip: order.postcode,
      email: order.email,
    },
    items: order.items.map((i) => ({
      variantId: getProduct(i.slug)?.printful?.variantId ?? 0,
      quantity: i.qty,
      name: getProduct(i.slug)?.name ?? i.slug,
    })),
  });
}
