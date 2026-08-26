import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { getOrder } from "@/lib/orders";
import { confirmFailStatus, confirmPaidOrder } from "@/lib/payments/confirm";
import { getOpenNodeCharge, openNodePaidGbp, parseOpenNodeBody, verifyOpenNodeHashedOrder } from "@/lib/payments/opennode";
import { guardWebhook } from "@/lib/request-guard";

export async function POST(req: Request) {
  const limited = guardWebhook(req, "wh-opennode");
  if (limited) return limited;

  const raw = await req.text();
  const body = parseOpenNodeBody(raw, req.headers.get("content-type"));
  if (!body?.id || !body.order_id) {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (!verifyOpenNodeHashedOrder(body.id, body.hashed_order)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  if (body.status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const charge = await getOpenNodeCharge(body.id);
  if (!charge?.id || charge.status !== "paid") {
    return NextResponse.json({ error: "charge not paid" }, { status: 400 });
  }
  if (charge.order_id && charge.order_id !== body.order_id) {
    return NextResponse.json({ error: "order mismatch" }, { status: 400 });
  }

  const order = await getOrder(body.order_id);
  if (order?.providerRef && order.providerRef !== charge.id) {
    return NextResponse.json({ error: "charge mismatch" }, { status: 400 });
  }

  const paidGbp = openNodePaidGbp(charge);
  if (paidGbp == null) {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }
  const confirmed = await confirmPaidOrder({
    orderId: body.order_id,
    providerRef: charge.id,
    paidGbp,
  });
  if (!confirmed.ok) {
    return NextResponse.json({ error: confirmed.error }, { status: confirmFailStatus(confirmed.error) });
  }
  if (!confirmed.already && !confirmed.order.fulfilled) await fulfillPaidOrder(confirmed.order.id);

  return NextResponse.json({ received: true });
}
