"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { HOUSE_COLORS, type Product } from "@/lib/products";
import { ColorChoiceGrid } from "./ColorSwatches";

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const colors = product.colors ?? (product.sizes ? HOUSE_COLORS : undefined);
  const [size, setSize] = useState(product.sizes?.[0]?.id ?? "");
  const [color, setColor] = useState(colors?.[0]?.id ?? "");
  const [added, setAdded] = useState(false);

  function onAdd() {
    add({
      slug: product.slug,
      size: product.sizes ? size : undefined,
      color: colors ? color : undefined,
      qty: 1,
    });
    setAdded(true);
  }

  return (
    <div className="space-y-4">
      {colors ? (
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Colour</legend>
          <ColorChoiceGrid colors={colors} value={color} onChange={setColor} />
        </fieldset>
      ) : null}
      {product.sizes ? (
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Size</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <label
                key={s.id}
                className={`cursor-pointer border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] ${
                  size === s.id ? "border-ember text-ember" : "border-paper/20 text-paper/80"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={size === s.id}
                  onChange={() => setSize(s.id)}
                  className="sr-only"
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onAdd}
          className="bg-ember px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
        >
          {added ? "Added" : "Add to cart"}
        </button>
        {added ? (
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="border border-paper/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
          >
            Checkout
          </button>
        ) : null}
      </div>
    </div>
  );
}
