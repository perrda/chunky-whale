import { createHmac, timingSafeEqual } from "crypto";

export function hmacHex(algo: "sha256" | "sha512", secret: string, raw: string) {
  return createHmac(algo, secret).update(raw).digest("hex");
}

export function safeEqualHex(a: string, b: string) {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    if (left.length !== right.length || left.length === 0) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function safeEqualString(a: string, b: string) {
  try {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}
