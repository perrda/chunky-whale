/** Printful-based estimates. Fulfilment 2–5 business days, then carrier transit. Not a guarantee. */

export type ShipRegion = {
  id: string;
  label: string;
  fulfilDays: string;
  transitDays: string;
  doorToDoor: string;
  firstItemGbp: { tee: number; hoodie: number; hat: number; mug: number };
};

export const SHIP_REGIONS: ShipRegion[] = [
  {
    id: "us",
    label: "United States",
    fulfilDays: "2–5",
    transitDays: "3–4",
    doorToDoor: "5–9 business days",
    firstItemGbp: { tee: 4, hoodie: 7, hat: 4, mug: 5 },
  },
  {
    id: "uk",
    label: "United Kingdom",
    fulfilDays: "2–5",
    transitDays: "4–8",
    doorToDoor: "6–13 business days",
    firstItemGbp: { tee: 4, hoodie: 6, hat: 4, mug: 5 },
  },
  {
    id: "eu",
    label: "European Union",
    fulfilDays: "2–5",
    transitDays: "3–7",
    doorToDoor: "5–12 business days",
    firstItemGbp: { tee: 4, hoodie: 6, hat: 4, mug: 5 },
  },
  {
    id: "asia",
    label: "Asia (JP / SG / AU hubs)",
    fulfilDays: "2–5",
    transitDays: "5–14",
    doorToDoor: "7–19 business days",
    firstItemGbp: { tee: 6, hoodie: 10, hat: 6, mug: 7 },
  },
  {
    id: "row",
    label: "Rest of world",
    fulfilDays: "2–5",
    transitDays: "10–20",
    doorToDoor: "12–25 business days",
    firstItemGbp: { tee: 10, hoodie: 14, hat: 10, mug: 10 },
  },
];

export function shipSkuKind(category: string): keyof ShipRegion["firstItemGbp"] {
  if (category === "hoodies") return "hoodie";
  if (category === "hats") return "hat";
  if (category === "drinkware" || category === "home") return "mug";
  return "tee";
}

/** Rough Printful first-item + £2 per extra unit. Estimate only — live checkout may differ. */
export function estimateShippingGbp(
  lines: { category: string; qty: number }[],
  country: string,
) {
  const region = regionForCountry(country);
  const units = lines.flatMap((l) => Array.from({ length: l.qty }, () => shipSkuKind(l.category)));
  if (!units.length) return 0;
  const first = Math.max(...units.map((k) => region.firstItemGbp[k]));
  return first + Math.max(0, units.length - 1) * 2;
}

export function regionForCountry(country: string) {
  const c = country.trim().toUpperCase();
  if (c === "US" || c === "USA" || c === "UNITED STATES") return SHIP_REGIONS[0];
  if (c === "GB" || c === "UK" || c === "UNITED KINGDOM") return SHIP_REGIONS[1];
  if (["DE", "FR", "ES", "IT", "NL", "IE", "PT", "BE", "AT", "PL", "SE", "DK"].includes(c)) return SHIP_REGIONS[2];
  if (["JP", "SG", "AU", "NZ", "KR", "HK", "TH"].includes(c)) return SHIP_REGIONS[3];
  return SHIP_REGIONS[4];
}

/** Items + Printful shipping estimate. Checkout, Stripe, and QA must use this. */
export function basketTotals(
  lines: { category: string; qty: number; priceGbp: number }[],
  country: string,
) {
  const itemsGbp = lines.reduce((n, l) => n + l.priceGbp * l.qty, 0);
  const shipGbp = estimateShippingGbp(lines, country);
  return { itemsGbp, shipGbp, totalGbp: itemsGbp + shipGbp };
}

export const PRINTERS = [
  { name: "Printful", role: "Primary. Apparel, hats, mugs, posters, embroidery." },
  { name: "Gelato", role: "Local print scale when a country is slow on Printful." },
  { name: "Printify", role: "Jewelry, socks overflow, extra drinkware." },
];
