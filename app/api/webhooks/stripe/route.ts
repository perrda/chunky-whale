import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { markPaid } from "@/lib/orders";
import { getStripe } from "@/lib/payments/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  if (!stripe) {
    return NextResponse.json({ ok: true, ignored: true });
  }
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET missing — card payments will not confirm");
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
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
      if (order && !order.fulfilled) await fulfillPaidOrder(order.id);
    }
  }

  return NextResponse.json({ received: true });
}
