import "server-only";
import { NextResponse } from "next/server";
import { site } from "@/lib/config";

function extraOrigins() {
  return (process.env.ALLOWED_DEV_ORIGIN ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((o) => {
      try {
        return o.startsWith("http") ? new URL(o).origin : `http://${o}`;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

export function shopOrigins() {
  let fromSite = "http://127.0.0.1:3001";
  try {
    fromSite = new URL(site.url).origin;
  } catch {
    /* keep default */
  }
  return new Set([
    fromSite,
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    ...extraOrigins(),
  ]);
}

/** LAN / .local hosts — only trusted while developing, so an iPhone on Wi‑Fi can check out. */
export function isPrivateOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return true;
    if (host.endsWith(".local")) return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    return false;
  } catch {
    return false;
  }
}

export function requestFromShop(req: Request) {
  const allowed = shopOrigins();
  const ok = (origin: string) =>
    allowed.has(origin) || (process.env.NODE_ENV !== "production" && isPrivateOrigin(origin));
  const origin = req.headers.get("origin");
  if (origin) return ok(origin);
  const referer = req.headers.get("referer");
  if (!referer) return false;
  try {
    return ok(new URL(referer).origin);
  } catch {
    return false;
  }
}

export function clientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

const buckets = new Map<string, { n: number; reset: number }>();

export function takeToken(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.reset) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (b.n >= max) return false;
  b.n += 1;
  return true;
}

export function rejectOrigin() {
  return NextResponse.json({ error: "Request must come from the shop." }, { status: 403 });
}

export function rejectRate() {
  return NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
}

/** Browser POSTs (checkout, newsletter, wholesale). Webhooks must not use this. */
export function guardShopPost(req: Request, bucket: string, max: number, windowMs: number) {
  if (!requestFromShop(req)) return rejectOrigin();
  if (!takeToken(`${bucket}:${clientKey(req)}`, max, windowMs)) return rejectRate();
  return null;
}

export function guardWebhook(req: Request, bucket: string) {
  if (!takeToken(`${bucket}:${clientKey(req)}`, 60, 60_000)) return rejectRate();
  return null;
}
