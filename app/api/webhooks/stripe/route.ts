import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { confirmFailStatus, confirmPaidOrder } from "@/lib/payments/confirm";
import { getStripe } from "@/lib/payments/stripe";
import { guardWebhook } from "@/lib/request-guard";

export async function POST(req: Request) {
  const limited = guardWebhook(req, "wh-stripe");
  if (limited) return limited;

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  if (!stripe || !secret) {
    console.error("Stripe webhook not configured — card payments will not confirm");
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

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as {
    metadata?: { orderId?: string };
    id: string;
    amount_total: number | null;
    currency: string | null;
    payment_status?: string;
  };
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ error: "missing order" }, { status: 400 });
  if (session.payment_status && session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
  }
  if ((session.currency ?? "gbp").toLowerCase() !== "gbp") {
    return NextResponse.json({ error: "currency" }, { status: 400 });
  }
  if (session.amount_total == null) {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }

  const confirmed = await confirmPaidOrder({
    orderId,
    providerRef: session.id,
    paidPence: session.amount_total,
  });
  if (!confirmed.ok) {
    return NextResponse.json({ error: confirmed.error }, { status: confirmFailStatus(confirmed.error) });
  }
  if (!confirmed.already && !confirmed.order.fulfilled) await fulfillPaidOrder(confirmed.order.id);

  return NextResponse.json({ received: true });
}
