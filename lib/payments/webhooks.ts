import "server-only";
import { hmacHex, safeEqualHex } from "@/lib/hmac";

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortKeysDeep((value as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  return value;
}

export function verifyCoinbaseSignature(raw: string, header: string | null) {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const digest = header.includes("=") ? header.split("=").pop() ?? "" : header;
  return safeEqualHex(digest, hmacHex("sha256", secret, raw));
}

/** NOWPayments signs recursively sorted JSON, not the raw body. */
export function verifyNowPaymentsSignature(raw: string, header: string | null) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !header) return false;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }
  const sorted = JSON.stringify(sortKeysDeep(parsed));
  return safeEqualHex(header, hmacHex("sha512", secret, sorted));
}
