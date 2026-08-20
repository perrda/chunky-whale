import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/fulfill";
import { confirmFailStatus, confirmPaidOrder } from "@/lib/payments/confirm";
import { verifyCoinbaseSignature } from "@/lib/payments/webhooks";
import { guardWebhook } from "@/lib/request-guard";

export async function POST(req: Request) {
  const limited = guardWebhook(req, "wh-coinbase");
  if (limited) return limited;

  const raw = await req.text();
  if (!verifyCoinbaseSignature(raw, req.headers.get("x-cc-webhook-signature"))) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  let json: {
    event?: {
      type?: string;
      data?: {
        metadata?: { orderId?: string };
        id?: string;
        pricing?: { local?: { amount?: string; currency?: string } };
      };
    };
  };
  try {
    json = JSON.parse(raw) as typeof json;
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const type = json.event?.type;
  const data = json.event?.data;
  const orderId = data?.metadata?.orderId;
  if (!(type === "charge:confirmed" || type === "charge:resolved") || !orderId) {
    return NextResponse.json({ received: true });
  }
  const local = data?.pricing?.local;
  if (!local?.amount || (local.currency ?? "GBP").toUpperCase() !== "GBP") {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }
  const paidGbp = Number(local.amount);
  if (!Number.isFinite(paidGbp)) {
    return NextResponse.json({ error: "amount missing" }, { status: 400 });
  }

  const confirmed = await confirmPaidOrder({
    orderId,
    providerRef: data?.id,
    paidGbp,
  });
  if (!confirmed.ok) {
    return NextResponse.json({ error: confirmed.error }, { status: confirmFailStatus(confirmed.error) });
  }
  if (!confirmed.already && !confirmed.order.fulfilled) await fulfillPaidOrder(confirmed.order.id);

  return NextResponse.json({ received: true });
}
