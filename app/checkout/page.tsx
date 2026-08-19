"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cartTotalGbp, useCart } from "@/lib/cart-store";
import { formatGbp, getProduct, isLiveProduct } from "@/lib/products";
import { regionForCountry } from "@/lib/shipping";
import { useAuth } from "@/lib/auth-store";
import { usePersistReady } from "@/lib/use-persist-ready";

const methods = [
  { id: "card" as const, label: "Card", note: "Visa, Mastercard via Stripe", rail: "stripe" as const },
  {
    id: "bitcoin" as const,
    label: "Bitcoin + Lightning",
    note: "On-chain or Lightning invoice",
    rail: "opennode" as const,
  },
  { id: "usdc" as const, label: "USDC", note: "USD Coin via Coinbase Commerce", rail: "coinbase" as const },
  { id: "usdt" as const, label: "USDT", note: "Tether via NOWPayments (TRC-20)", rail: "nowpayments" as const },
];

type PayStatus = {
  demo?: boolean;
  stripe?: boolean;
  opennode?: boolean;
  coinbase?: boolean;
  nowpayments?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const account = useAuth((s) => s.account);
  const cartReady = usePersistReady(useCart.persist);
  const authReady = usePersistReady(useAuth.persist);
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("bitcoin");
  const [country, setCountry] = useState("GB");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [rails, setRails] = useState<PayStatus>({ demo: true });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setCancelled(q.get("cancelled") === "1");
    fetch("/api/status")
      .then((r) => r.json())
      .then((s: PayStatus) => setRails(s))
      .catch(() => setRails({ demo: true }));
  }, []);

  const anyLive = Boolean(rails.stripe || rails.opennode || rails.coinbase || rails.nowpayments);
  const liveById = useMemo(() => {
    const map = {} as Record<(typeof methods)[number]["id"], boolean>;
    for (const m of methods) map[m.id] = Boolean(rails[m.rail]);
    return map;
  }, [rails]);
  const methodLive = (id: (typeof methods)[number]["id"]) => liveById[id];
  const methodAllowed = (id: (typeof methods)[number]["id"]) => !anyLive || methodLive(id);

  useEffect(() => {
    if (anyLive && !liveById[method]) {
      const first = methods.find((m) => liveById[m.id]);
      if (first) setMethod(first.id);
    }
  }, [anyLive, liveById, method]);

  const total = cartTotalGbp(items);
  const ready = cartReady && authReady;

  const lines = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        product: getProduct(i.slug),
        live: isLiveProduct(i.slug),
      })),
    [items],
  );
  const stale = lines.some((l) => !l.live);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!methodAllowed(method)) {
      setError("That payment method is not connected yet. Choose a live method.");
      return;
    }
    if (stale) {
      setError("A piece in the basket is no longer for sale. Remove it, then try again.");
      return;
    }
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        name: fd.get("name"),
        address1: fd.get("address1"),
        city: fd.get("city"),
        country: fd.get("country"),
        postcode: fd.get("postcode"),
        method,
        items: items.map((i) => ({ slug: i.slug, size: i.size, color: i.color, qty: i.qty })),
      }),
    });
    const data = (await res.json()) as { error?: string; payUrl?: string; orderId?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not start payment.");
      return;
    }
    if (data.payUrl?.startsWith("http")) {
      window.location.href = data.payUrl;
      return;
    }
    router.push(data.payUrl ?? `/checkout/success?order=${data.orderId}`);
  }

  if (!ready) return <p className="px-6 py-20 font-serif text-paper/60">Loading checkout…</p>;

  if (items.length === 0) {
    return (
      <p className="px-6 py-20 font-serif">
        Basket is empty.{" "}
        <Link href="/shop" className="text-ember">
          Shop
        </Link>
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 md:grid-cols-2 md:px-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <h1 className="font-display text-4xl font-extrabold">Checkout</h1>
        <p className="font-serif text-paper/75">
          Guest checkout — no account required. Or{" "}
          <Link href="/login" className="text-ember">
            log in
          </Link>{" "}
          to save details for next time.
        </p>
        {cancelled ? (
          <p className="border border-ember/40 px-3 py-2 font-serif text-sm text-ember">
            Payment was cancelled. Nothing was charged. Choose a method and try again.
          </p>
        ) : null}
        {stale ? (
          <p className="border border-ember/40 px-3 py-2 font-serif text-sm text-ember">
            A piece in the basket is no longer for sale. Remove it on the{" "}
            <Link href="/cart" className="underline">
              basket
            </Link>{" "}
            page.
          </p>
        ) : null}
        <Field name="email" label="Email" type="email" autoComplete="email" defaultValue={account?.email} />
        <Field name="name" label="Full name" autoComplete="name" defaultValue={account?.name} />
        <Field name="address1" label="Address" autoComplete="address-line1" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field name="city" label="City" autoComplete="address-level2" />
          <Field name="postcode" label="Postcode" autoComplete="postal-code" />
        </div>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Country</span>
          <select
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country"
            className="mt-1 w-full border border-paper/20 bg-ink px-3 py-2 font-serif text-paper"
          >
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="NL">Netherlands</option>
            <option value="IE">Ireland</option>
            <option value="AE">United Arab Emirates</option>
            <option value="TH">Thailand</option>
            <option value="SG">Singapore</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
            <option value="CA">Canada</option>
          </select>
        </label>
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Pay with</legend>
          <div className="mt-3 space-y-2">
            {methods.map((m) => {
              const allowed = methodAllowed(m.id);
              return (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 border px-4 py-3 ${
                    allowed ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  } ${method === m.id ? "border-ember" : "border-paper/20"}`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    disabled={!allowed}
                    onChange={() => setMethod(m.id)}
                    className="mt-1 accent-ember"
                  />
                  <span>
                    <span className="block font-display font-bold">{m.label}</span>
                    <span className="font-serif text-sm text-paper/70">
                      {allowed
                        ? anyLive
                          ? `${m.note} — live`
                          : `${m.note} — demo until keys are live`
                        : `${m.note} — not connected yet`}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {error ? <p className="font-serif text-sm text-ember">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || stale || !methodAllowed(method)}
          className="bg-ember px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink disabled:opacity-60"
        >
          {busy ? "Starting payment…" : `Pay ${formatGbp(total)}`}
        </button>
        <p className="font-serif text-sm text-muted">
          {!anyLive
            ? "Demo mode — no real money is taken until payment keys are live. Card, Bitcoin + Lightning, USDC, and USDT are equal once keys exist."
            : methodLive(method)
              ? "This method is live. You will be sent to the payment provider to finish. Crypto is final once confirmed."
              : "That method is not connected yet. Pick a live rail, or add its keys."}
        </p>
        <p className="font-serif text-sm text-paper/70">
          <Link href="/shipping" className="text-ember">
            Shipping times
          </Link>
          {" · "}
          <Link href="/legal/refunds" className="text-ember">
            Returns
          </Link>
          {" · "}
          <Link href="/legal/terms" className="text-ember">
            Terms
          </Link>
        </p>
      </form>
      <aside>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Order</h2>
        <ul className="mt-4 space-y-3">
          {lines.map((i) => {
            if (!i.product) return null;
            return (
              <li key={`${i.slug}-${i.size}-${i.color}`} className="flex justify-between gap-4 font-serif text-sm">
                <span>
                  {i.product.name} {i.color ? `${i.color} ` : ""}
                  {i.size ? `(${i.size})` : ""} × {i.qty}
                  {!i.live ? " — no longer for sale" : ""}
                </span>
                <span className="font-mono text-gold">{formatGbp(i.product.priceGbp * i.qty)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 flex justify-between border-t border-paper/15 pt-4 font-display text-lg">
          Total <span className="font-mono text-gold">{formatGbp(total)}</span>
        </p>
        <p className="mt-4 font-serif text-sm text-paper/70">
          Printful estimate to {regionForCountry(country).label}: {regionForCountry(country).doorToDoor}. Shipping is
          added at live checkout (not in this demo total). UK VAT 20% when we go live if you are in the UK.
        </p>
      </aside>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{label}</span>
      <input
        name={name}
        type={type}
        required
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="mt-1 w-full border border-paper/20 bg-ink px-3 py-2 font-serif text-paper"
      />
    </label>
  );
}
