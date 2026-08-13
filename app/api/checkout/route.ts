import { NextResponse } from "next/server";
import { z } from "zod";
import { getProduct } from "@/lib/products";
import { createOrder, newOrderId } from "@/lib/orders";
import { paymentsReady, site } from "@/lib/config";
import { createStripeCheckout } from "@/lib/payments/stripe";
import { createOpenNodeCharge } from "@/lib/payments/opennode";
import { createCoinbaseCharge } from "@/lib/payments/coinbase";
import { createNowPaymentsInvoice } from "@/lib/payments/nowpayments";

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address1: z.string().min(3),
  city: z.string().min(2),
  country: z.string().min(2),
  postcode: z.string().min(2),
  method: z.enum(["card", "bitcoin", "usdc", "usdt"]),
  items: z
    .array(
      z.object({
        slug: z.string(),
        size: z.string().optional(),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form — something is missing." },
      { status: 400 },
    );
  }

  const items: { slug: string; size?: string; qty: number; priceGbp: number }[] = [];
  for (const i of parsed.data.items) {
    const p = getProduct(i.slug);
    if (!p) {
      return NextResponse.json({ error: "Unknown product in cart." }, { status: 400 });
    }
    items.push({
      slug: i.slug,
      size: i.size,
      qty: i.qty,
      priceGbp: p.priceGbp,
    });
  }

  const totalGbp = items.reduce((n, i) => n + i.priceGbp * i.qty, 0);
  const id = newOrderId();
  const ready = paymentsReady();
  const origin = site.url;
  const success = `${origin}/checkout/success?order=${id}`;

  let payUrl: string | undefined;
  let providerRef: string | undefined;
  let demo = true;

  try {
    if (parsed.data.method === "card" && ready.stripe) {
      const session = await createStripeCheckout({
        orderId: id,
        email: parsed.data.email,
        lineItems: items.map((i) => {
          const p = getProduct(i.slug)!;
          return { name: `${p.name}${i.size ? ` / ${i.size}` : ""}`, amountGbp: i.priceGbp, qty: i.qty };
        }),
        successUrl: success,
        cancelUrl: `${origin}/checkout?cancelled=1`,
      });
      if (session?.url) {
        payUrl = session.url;
        providerRef = session.id;
        demo = false;
      }
    }

    if (parsed.data.method === "bitcoin" && ready.opennode) {
      const charge = await createOpenNodeCharge({
        orderId: id,
        amountGbp: totalGbp,
        email: parsed.data.email,
        callbackUrl: `${origin}/api/webhooks/opennode`,
        successUrl: success,
      });
      if (charge?.url) {
        payUrl = charge.url;
        providerRef = charge.id;
        demo = false;
      }
    }

    if (parsed.data.method === "usdc" && ready.coinbase) {
      const charge = await createCoinbaseCharge({
        orderId: id,
        amountGbp: totalGbp,
        email: parsed.data.email,
        redirectUrl: success,
      });
      if (charge?.url) {
        payUrl = charge.url;
        providerRef = charge.id;
        demo = false;
      }
    }

    if (parsed.data.method === "usdt" && ready.nowpayments) {
      const invoice = await createNowPaymentsInvoice({
        orderId: id,
        amountGbp: totalGbp,
        payCurrency: "usdttrc20",
        successUrl: success,
        ipnUrl: `${origin}/api/webhooks/nowpayments`,
      });
      if (invoice?.url) {
        payUrl = invoice.url;
        providerRef = invoice.id;
        demo = false;
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Payment provider failed. Try another method." },
      { status: 502 },
    );
  }

  await createOrder({
    id,
    email: parsed.data.email,
    name: parsed.data.name,
    address1: parsed.data.address1,
    city: parsed.data.city,
    country: parsed.data.country,
    postcode: parsed.data.postcode,
    method: parsed.data.method,
    items,
    totalGbp,
    status: demo ? "pending" : "pending",
    demo,
    createdAt: new Date().toISOString(),
    providerRef,
    payUrl,
  });

  return NextResponse.json({
    orderId: id,
    demo,
    payUrl: payUrl ?? `/checkout/success?order=${id}&demo=1`,
  });
}
