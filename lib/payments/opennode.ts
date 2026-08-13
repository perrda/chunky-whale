const OPENNODE =
  process.env.OPENNODE_API_URL ?? "https://api.opennode.com";

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
      amount: Math.round(input.amountGbp * 100),
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

export function verifyOpenNodeSignature(raw: string, header: string | null) {
  const secret = process.env.OPENNODE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  return header === secret || raw.includes(secret);
}
