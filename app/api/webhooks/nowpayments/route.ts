import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { markPaid } from "@/lib/orders";
import { verifyNowPaymentsSignature } from "@/lib/payments/webhooks";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyNowPaymentsSignature(raw, req.headers.get("x-nowpayments-sig"))) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  let json: {
    payment_status?: string;
    order_id?: string;
    payment_id?: string;
  };
  try {
    json = JSON.parse(raw) as typeof json;
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (json.payment_status === "finished" && json.order_id) {
    const order = await markPaid(json.order_id, json.payment_id);
    if (order && !order.fulfilled) await fulfillPaidOrder(order.id);
  }
  return NextResponse.json({ received: true });
}
