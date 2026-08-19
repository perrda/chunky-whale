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

export type PrintfulCreateResult =
  | { ok: true; id: string }
  | { error: "missing_variant_ids" | "printful_not_configured" | "printful_failed" };

export async function createPrintfulOrder(input: {
  externalId: string;
  recipient: PrintfulRecipient;
  items: { variantId: number; quantity: number; name: string }[];
}): Promise<PrintfulCreateResult> {
  if (input.items.some((i) => !i.variantId || i.variantId <= 0)) {
    console.error("Printful blocked: missing variant IDs", input.externalId);
    return { error: "missing_variant_ids" };
  }
  if (!printfulConfigured()) {
    return { error: "printful_not_configured" };
  }
  const data = (await printfulFetch("/orders", {
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
  })) as { result?: { id?: number | string } } | null;

  const id = data?.result?.id;
  if (id === undefined || id === null || id === "") {
    return { error: "printful_failed" };
  }
  return { ok: true, id: String(id) };
}
