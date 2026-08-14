const COMMERCE = "https://api.commerce.coinbase.com";

export async function createCoinbaseCharge(input: {
  orderId: string;
  amountGbp: number;
  email: string;
  redirectUrl: string;
}) {
  const key = process.env.COINBASE_COMMERCE_API_KEY;
  if (!key) return null;
  const res = await fetch(`${COMMERCE}/charges`, {
    method: "POST",
    headers: {
      "X-CC-Api-Key": key,
      "X-CC-Version": "2018-03-22",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `STACKHOUSE ${input.orderId}`,
      description: "Bitcoin merch — USDC or other supported assets",
      local_price: { amount: input.amountGbp.toFixed(2), currency: "GBP" },
      pricing_type: "fixed_price",
      metadata: { orderId: input.orderId, email: input.email },
      redirect_url: input.redirectUrl,
    }),
  });
  if (!res.ok) {
    console.error("Coinbase Commerce error", await res.text());
    return null;
  }
  const json = (await res.json()) as {
    data: { id: string; hosted_url: string };
  };
  return { id: json.data.id, url: json.data.hosted_url };
}
