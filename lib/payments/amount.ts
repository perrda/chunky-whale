/** Fiat major units for providers that are not Stripe (pence). £28 → 28. */
export function fiatMajorAmount(gbp: number) {
  return Number(gbp.toFixed(2));
}

/** Stripe and similar: amount_total is pence. £28.50 → 2850. Never send this as OpenNode `amount`. */
export function gbpToPence(gbp: number) {
  return Math.round(fiatMajorAmount(gbp) * 100);
}

/** True when two GBP amounts match within 2p (FX / rounding slack). */
export function gbpAmountsMatch(expectedGbp: number, actualGbp: number, slack = 0.02) {
  return Math.abs(fiatMajorAmount(expectedGbp) - fiatMajorAmount(actualGbp)) <= slack;
}

export function penceMatchesGbp(expectedGbp: number, actualPence: number) {
  return Number.isFinite(actualPence) && gbpToPence(expectedGbp) === actualPence;
}
