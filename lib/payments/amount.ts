/** Fiat major units for providers that are not Stripe (pence). £28 → 28. */
export function fiatMajorAmount(gbp: number) {
  return Number(gbp.toFixed(2));
}
