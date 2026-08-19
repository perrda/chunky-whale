"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "./products";

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
        const items = [...get().items];
        const i = items.findIndex((x) => keyOf(x) === keyOf(item));
        if (i >= 0) {
          items[i] = { ...items[i], qty: items[i].qty + item.qty };
        } else {
          items.push(item);
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
        const clamped = Math.min(20, Math.max(1, Math.round(n)));
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
    return n + (p ? p.priceGbp * i.qty : 0);
  }, 0);
}
