import "server-only";
import { hmacHex, safeEqualHex } from "@/lib/hmac";
import { fiatMajorAmount } from "@/lib/payments/amount";

const OPENNODE = process.env.OPENNODE_API_URL ?? "https://api.opennode.com";

export async function createOpenNodeCharge(input: {
  orderId: string;
  amountGbp: number;
  email: string;
  callbackUrl: string;
  successUrl: string;
}) {
  const key = process.env.OPENNODE_API_KEY;
  if (!key) return null;
  const res = await fetch(`${OPENNODE}/v1/charges`, {
    method: "POST",
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // OpenNode treats `amount` as the fiat major unit when `currency` is set (e.g. 28 = £28).
      amount: fiatMajorAmount(input.amountGbp),
      currency: "GBP",
      description: `STACKHOUSE ${input.orderId}`,
      order_id: input.orderId,
      customer_email: input.email,
      callback_url: input.callbackUrl,
      success_url: input.successUrl,
      auto_settle: false,
    }),
  });
  if (!res.ok) {
    console.error("OpenNode error", await res.text());
    return null;
  }
  const json = (await res.json()) as {
    data: { id: string; hosted_checkout_url: string };
  };
  return { id: json.data.id, url: json.data.hosted_checkout_url };
}

export async function getOpenNodeCharge(id: string) {
  const key = process.env.OPENNODE_API_KEY;
  if (!key || !id) return null;
  const res = await fetch(`${OPENNODE}/v1/charge/${encodeURIComponent(id)}`, {
    headers: { Authorization: key },
  });
  if (!res.ok) {
    console.error("OpenNode charge lookup failed", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as {
    data?: {
      id?: string;
      status?: string;
      order_id?: string;
      fiat_value?: number;
      amount?: number;
      price?: number;
      currency?: string;
    };
  };
  return json.data ?? null;
}

/** Prefer fiat_value. GBP `amount`/`price` only if they look like pounds, not sats. */
export function openNodePaidGbp(charge: {
  fiat_value?: number;
  amount?: number;
  price?: number;
  currency?: string;
}): number | undefined {
  if (typeof charge.fiat_value === "number" && Number.isFinite(charge.fiat_value)) {
    return charge.fiat_value;
  }
  const cur = (charge.currency ?? "").toUpperCase();
  if (cur !== "GBP") return undefined;
  if (typeof charge.amount === "number" && charge.amount < 10_000) return charge.amount;
  if (typeof charge.price === "number" && charge.price < 10_000) return charge.price;
  return undefined;
}

/** OpenNode hashed_order = HMAC-SHA256(charge id, API key). */
export function verifyOpenNodeHashedOrder(chargeId: string, hashed: string | undefined) {
  const key = process.env.OPENNODE_API_KEY;
  if (!key || !hashed || !chargeId) return false;
  return safeEqualHex(hashed, hmacHex("sha256", key, chargeId));
}

export function parseOpenNodeBody(raw: string, contentType: string | null) {
  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const p = new URLSearchParams(raw);
    return {
      id: p.get("id") ?? undefined,
      status: p.get("status") ?? undefined,
      order_id: p.get("order_id") ?? undefined,
      hashed_order: p.get("hashed_order") ?? undefined,
    };
  }
  try {
    return JSON.parse(raw) as {
      id?: string;
      status?: string;
      order_id?: string;
      hashed_order?: string;
    };
  } catch {
    return null;
  }
}
