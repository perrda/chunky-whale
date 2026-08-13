import { NextResponse } from "next/server";
import { markPaid } from "@/lib/orders";
import { createPrintfulOrder } from "@/lib/printful";
import { getProduct } from "@/lib/products";

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as
    | {
        event?: { type?: string; data?: { metadata?: { orderId?: string }; id?: string } };
      }
    | null;
  if (!json) return NextResponse.json({ error: "bad body" }, { status: 400 });

  const type = json.event?.type;
  const orderId = json.event?.data?.metadata?.orderId;
  if ((type === "charge:confirmed" || type === "charge:resolved") && orderId) {
    const order = await markPaid(orderId, json.event?.data?.id);
    if (order) {
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
  }

  return NextResponse.json({ received: true });
}
