import { claimFulfillment, markFulfilled, releaseFulfillment } from "@/lib/orders";
import { createPrintfulOrder } from "@/lib/printful";
import { getProduct, printfulVariantId } from "@/lib/products";

export async function fulfillPaidOrder(orderId: string) {
  const claimed = await claimFulfillment(orderId);
  if (!claimed) return { skipped: true };

  const items = claimed.items.map((i) => ({
    variantId: printfulVariantId(i.slug, i.size, i.color),
    quantity: i.qty,
    name: `${getProduct(i.slug)?.name ?? i.slug}${i.size ? ` / ${i.size}` : ""}${i.color ? ` / ${i.color}` : ""}`,
  }));

  if (items.some((i) => i.variantId <= 0)) {
    console.error("Printful blocked: no variant IDs mapped for", orderId);
    await releaseFulfillment(orderId);
    return { error: "missing_variant_ids" };
  }

  const result = await createPrintfulOrder({
    externalId: claimed.id,
    recipient: {
      name: claimed.name,
      address1: claimed.address1,
      city: claimed.city,
      country_code: claimed.country,
      zip: claimed.postcode,
      email: claimed.email,
    },
    items,
  });

  if (!("ok" in result) || !result.ok) {
    await releaseFulfillment(orderId);
    return result;
  }

  await markFulfilled(claimed.id, result.id);
  return result;
}
