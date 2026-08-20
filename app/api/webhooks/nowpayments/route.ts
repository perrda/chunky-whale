import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { confirmFailStatus, confirmPaidOrder } from "@/lib/payments/confirm";
import { verifyNowPaymentsSignature } from "@/lib/payments/webhooks";
import { guardWebhook } from "@/lib/request-guard";

export async function POST(req: Request) {
  const limited = guardWebhook(req, "wh-nowpayments");
  if (limited) return limited;

  const raw = await req.text();
  if (!verifyNowPaymentsSignature(raw, req.headers.get("x-nowpayments-sig"))) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  let json: {
    payment_status?: string;
    order_id?: string;
    payment_id?: string;
    price_amount?: number | string;
    price_currency?: string;
  };
  try {
    json = JSON.parse(raw) as typeof json;
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (json.payment_status !== "finished" || !json.order_id) {
    return NextResponse.json({ received: true });
  }
  if ((json.price_currency ?? "").toLowerCase() !== "gbp" || json.price_amount == null) {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }
  const paidGbp = Number(json.price_amount);
  if (!Number.isFinite(paidGbp)) {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }

  const confirmed = await confirmPaidOrder({
    orderId: json.order_id,
    providerRef: json.payment_id,
    paidGbp,
  });
  if (!confirmed.ok) {
    return NextResponse.json({ error: confirmed.error }, { status: confirmFailStatus(confirmed.error) });
  }
  if (!confirmed.already && !confirmed.order.fulfilled) await fulfillPaidOrder(confirmed.order.id);

  return NextResponse.json({ received: true });
}
