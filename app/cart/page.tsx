"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotalGbp, useCart } from "@/lib/cart-store";
import { formatGbp, getProduct } from "@/lib/products";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return <p className="px-6 py-20 font-serif text-paper/60">Loading cart…</p>;
  }

  const total = cartTotalGbp(items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-6 font-serif text-paper/75">
          Empty.{" "}
          <Link href="/shop" className="text-ember">
            Shop the drop
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-paper/10">
            {items.map((item) => {
              const p = getProduct(item.slug);
              if (!p) return null;
              return (
                <li key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 py-6">
                  <div className="relative h-24 w-32 shrink-0 bg-surface">
                    <Image src={p.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold">{p.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {p.editionId}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                    <p className="mt-1 font-mono text-sm text-gold">{formatGbp(p.priceGbp)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={item.qty}
                          onChange={(e) => setQty(item.slug, item.size, item.color, Number(e.target.value))}
                          className="ml-2 w-16 border border-paper/20 bg-ink px-2 py-1 text-paper"
                        />
                      </label>
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
          <div className="mt-8 flex items-center justify-between border-t border-paper/15 pt-6">
            <p className="font-serif">Total</p>
            <p className="font-mono text-xl text-gold">{formatGbp(total)}</p>
          </div>
          <Link
            href="/checkout"
            className="mt-8 inline-block bg-ember px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
