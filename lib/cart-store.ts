"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, isLiveProduct } from "./products";

export type CartItem = {
  slug: string;
  size?: string;
  color?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (slug: string, size: string | undefined, color: string | undefined, qty: number) => void;
  remove: (slug: string, size?: string, color?: string) => void;
  clear: () => void;
};

function keyOf(item: { slug: string; size?: string; color?: string }) {
  return `${item.slug}::${item.size ?? ""}::${item.color ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const p = getProduct(item.slug);
        const cap = p?.limited ? Math.max(0, p.remaining ?? 0) : 20;
        if (cap <= 0) return;
        const items = [...get().items];
        const i = items.findIndex((x) => keyOf(x) === keyOf(item));
        if (i >= 0) {
          items[i] = { ...items[i], qty: Math.min(cap, items[i].qty + item.qty) };
        } else {
          items.push({ ...item, qty: Math.min(cap, item.qty) });
        }
        set({ items });
      },
      setQty: (slug, size, color, qty) => {
        const n = Number(qty);
        if (!Number.isFinite(n) || n <= 0) {
          set({
            items: get().items.filter((x) => keyOf(x) !== keyOf({ slug, size, color })),
          });
          return;
        }
        const p = getProduct(slug);
        const cap = p?.limited ? Math.max(1, Math.min(20, p.remaining ?? 1)) : 20;
        const clamped = Math.min(cap, Math.max(1, Math.round(n)));
        set({
          items: get().items.map((x) =>
            keyOf(x) === keyOf({ slug, size, color }) ? { ...x, qty: clamped } : x,
          ),
        });
      },
      remove: (slug, size, color) =>
        set({
          items: get().items.filter((x) => keyOf(x) !== keyOf({ slug, size, color })),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "stackhouse-cart", skipHydration: true },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotalGbp(items: CartItem[]) {
  return items.reduce((n, i) => {
    const p = getProduct(i.slug);
    if (!p || !isLiveProduct(i.slug)) return n;
    return n + p.priceGbp * i.qty;
  }, 0);
}
