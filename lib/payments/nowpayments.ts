export async function createNowPaymentsInvoice(input: {
  orderId: string;
  amountGbp: number;
  payCurrency: "usdttrc20" | "usdcerc20" | "usdterc20";
  successUrl: string;
  ipnUrl: string;
}) {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: input.amountGbp,
      price_currency: "gbp",
      pay_currency: input.payCurrency,
      order_id: input.orderId,
      order_description: `ORANGEFORGE ${input.orderId}`,
      success_url: input.successUrl,
      ipn_callback_url: input.ipnUrl,
    }),
  });
  if (!res.ok) {
    console.error("NOWPayments error", await res.text());
    return null;
  }
  const json = (await res.json()) as { id: string; invoice_url: string };
  return { id: json.id, url: json.invoice_url };
}
