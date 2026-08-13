const PRINTFUL = "https://api.printful.com";

export function printfulConfigured() {
  return Boolean(process.env.PRINTFUL_API_KEY);
}

async function printfulFetch(path: string, init?: RequestInit) {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) return null;
  const res = await fetch(`${PRINTFUL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Printful error", res.status, text);
    return null;
  }
  return res.json();
}

export type PrintfulRecipient = {
  name: string;
  address1: string;
  city: string;
  country_code: string;
  zip: string;
  email: string;
};

export async function createPrintfulOrder(input: {
  externalId: string;
  recipient: PrintfulRecipient;
  items: { variantId: number; quantity: number; name: string }[];
}) {
  if (!printfulConfigured()) {
    return { demo: true, id: `pf-demo-${input.externalId}` };
  }
  const data = await printfulFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      external_id: input.externalId,
      recipient: input.recipient,
      items: input.items.map((i) => ({
        variant_id: i.variantId,
        quantity: i.quantity,
        name: i.name,
      })),
    }),
  });
  return data ?? { error: "printful_failed" };
}
