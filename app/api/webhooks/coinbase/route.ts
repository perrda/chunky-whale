import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { markPaid } from "@/lib/orders";
import { verifyCoinbaseSignature } from "@/lib/payments/webhooks";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyCoinbaseSignature(raw, req.headers.get("x-cc-webhook-signature"))) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  let json: {
    event?: { type?: string; data?: { metadata?: { orderId?: string }; id?: string } };
  };
  try {
    json = JSON.parse(raw) as typeof json;
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const type = json.event?.type;
  const orderId = json.event?.data?.metadata?.orderId;
  if ((type === "charge:confirmed" || type === "charge:resolved") && orderId) {
    const order = await markPaid(orderId, json.event?.data?.id);
    if (order && !order.fulfilled) await fulfillPaidOrder(order.id);
  }
  return NextResponse.json({ received: true });
}
