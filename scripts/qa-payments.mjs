import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";

function fiatMajorAmount(gbp) {
  return Number(gbp.toFixed(2));
}

function hmacHex(algo, secret, raw) {
  return createHmac(algo, secret).update(raw).digest("hex");
}

function safeEqualHex(a, b) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = sortKeysDeep(value[k]);
        return acc;
      }, {});
  }
  return value;
}

assert.equal(fiatMajorAmount(28), 28);
assert.equal(fiatMajorAmount(28.5), 28.5);
assert.notEqual(Math.round(28 * 100), fiatMajorAmount(28));

const raw = JSON.stringify({ payment_status: "finished", order_id: "SH-1" });
const parsed = JSON.parse(raw);
const sorted = JSON.stringify(sortKeysDeep(parsed));
const sig = hmacHex("sha512", "secret", sorted);
assert.equal(safeEqualHex(sig, hmacHex("sha512", "secret", sorted)), true);
assert.equal(safeEqualHex(sig, hmacHex("sha512", "secret", raw)), false);

console.log("qa-payments: ok");
