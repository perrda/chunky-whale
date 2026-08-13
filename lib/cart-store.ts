"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "./products";

export type CartItem = {
  slug: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (slug: string, size: string | undefined, qty: number) => void;
  remove: (slug: string, size?: string) => void;
  clear: () => void;
};

function keyOf(item: { slug: string; size?: string }) {
  return `${item.slug}::${item.size ?? ""}`;
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
      setQty: (slug, size, qty) => {
        if (qty <= 0) {
          set({
            items: get().items.filter((x) => keyOf(x) !== keyOf({ slug, size })),
          });
          return;
        }
        set({
          items: get().items.map((x) =>
            keyOf(x) === keyOf({ slug, size }) ? { ...x, qty } : x,
          ),
        });
      },
      remove: (slug, size) =>
        set({
          items: get().items.filter((x) => keyOf(x) !== keyOf({ slug, size })),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "orangeforge-cart", skipHydration: true },
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
