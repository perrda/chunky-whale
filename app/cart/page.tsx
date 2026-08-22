"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GarmentImage } from "@/components/GarmentImage";
import { cartTotalGbp, useCart } from "@/lib/cart-store";
import {
  colorLabel,
  colorsFor,
  formatGbp,
  getProduct,
  isLiveProduct,
  needsRecolor,
  productImage,
  sizeLabel,
} from "@/lib/products";
import { estimateShippingGbp } from "@/lib/shipping";
import { usePersistReady } from "@/lib/use-persist-ready";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const ready = usePersistReady(useCart.persist);

  if (!ready) {
    return <p className="px-6 py-20 font-serif text-paper/60">Loading basket…</p>;
  }

  const total = cartTotalGbp(items);
  const stale = items.some((item) => !isLiveProduct(item.slug));
  const shipLines = items.flatMap((item) => {
    const p = getProduct(item.slug);
    return p && isLiveProduct(item.slug) ? [{ category: p.category, qty: item.qty }] : [];
  });
  const ship = estimateShippingGbp(shipLines, "GB");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Basket</h1>
      {items.length === 0 ? (
        <div className="mt-8">
          <p className="font-serif text-lg text-paper/75">Nothing in here yet.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-ember px-6 py-3 font-display text-sm font-bold text-ink"
          >
            Shop Bitcoin merch
          </Link>
        </div>
      ) : (
        <>
          {stale ? (
            <p className="mt-6 border border-ember/40 px-3 py-2 font-serif text-sm text-ember">
              One or more pieces are no longer for sale. Remove them before checkout.
            </p>
          ) : null}
          <ul className="mt-10 divide-y divide-paper/10">
            {items.map((item) => {
              const p = getProduct(item.slug);
              const live = isLiveProduct(item.slug);
              const colour = p ? colorLabel(p, item.color) : item.color;
              const size = p ? sizeLabel(p, item.size) : item.size;
              return (
                <li key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 py-6">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-white">
                    {p ? (
                      <GarmentImage
                        src={productImage(p, item.color)}
                        hex={colorsFor(p)?.find((c) => c.id === item.color)?.hex}
                        recolor={needsRecolor(p, item.color)}
                        alt={p.name}
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold">{p?.name ?? item.slug}</p>
                    <p className="font-serif text-sm text-paper/70">
                      {[size, colour].filter(Boolean).join(" · ") || p?.editionId}
                    </p>
                    {!live ? (
                      <p className="mt-1 font-serif text-sm text-ember">No longer for sale</p>
                    ) : (
                      <p className="mt-1 font-mono text-sm text-gold">{formatGbp(p!.priceGbp)}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      {live ? (
                        <CartQty
                          qty={item.qty}
                          onCommit={(n) => setQty(item.slug, item.size, item.color, n)}
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => remove(item.slug, item.size, item.color)}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 space-y-2 border-t border-paper/15 pt-6">
            <div className="flex items-center justify-between font-serif">
              <p>Items</p>
              <p className="font-mono text-gold">{formatGbp(total)}</p>
            </div>
            <div className="flex items-center justify-between font-serif text-sm text-paper/75">
              <p>Shipping estimate (UK)</p>
              <p className="font-mono">{formatGbp(ship)}</p>
            </div>
            <div className="flex items-center justify-between pt-2 font-display text-lg">
              <p>Estimated total</p>
              <p className="font-mono text-gold">{formatGbp(total + ship)}</p>
            </div>
            <p className="font-serif text-sm text-paper/60">
              Shipping is an estimate. The live checkout total may differ by country.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {stale ? (
              <p className="font-serif text-sm text-paper/70">Remove retired pieces to continue.</p>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className="inline-block bg-ember px-6 py-3 text-center font-display text-sm font-bold text-ink"
                >
                  Checkout as guest
                </Link>
                <Link
                  href="/login"
                  className="inline-block border border-paper/30 px-6 py-3 text-center font-display text-sm font-bold"
                >
                  Login then checkout
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CartQty({ qty, onCommit }: { qty: number; onCommit: (n: number) => void }) {
  const [draft, setDraft] = useState(String(qty));
  useEffect(() => {
    setDraft(String(qty));
  }, [qty]);
  return (
    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
      Qty
      <input
        type="number"
        min={1}
        max={20}
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const n = Number(draft);
          if (!Number.isFinite(n) || n < 1) {
            setDraft(String(qty));
            return;
          }
          const next = Math.min(20, Math.max(1, Math.round(n)));
          setDraft(String(next));
          onCommit(next);
        }}
        className="ml-2 w-16 border border-paper/20 bg-ink px-2 py-1 text-paper"
      />
    </label>
  );
}
