import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { markPaid } from "@/lib/orders";
import { parseOpenNodeBody, verifyOpenNodeHashedOrder } from "@/lib/payments/opennode";

export async function POST(req: Request) {
  const raw = await req.text();
  const body = parseOpenNodeBody(raw, req.headers.get("content-type"));
  if (!body?.id || !body.order_id) {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (!verifyOpenNodeHashedOrder(body.id, body.hashed_order)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  if (body.status === "paid") {
    const order = await markPaid(body.order_id, body.id);
    if (order && !order.fulfilled) await fulfillPaidOrder(order.id);
  }
  return NextResponse.json({ received: true });
}
