"use client";

import Link from "next/link";
import { useState } from "react";
import { colorsFor, formatGbp, HOUSE_COLORS, productImage, type Product } from "@/lib/products";
import { GarmentImage } from "./GarmentImage";

export function ProductCard({ product }: { product: Product }) {
  const swatches = colorsFor(product) ?? (product.sizes ? HOUSE_COLORS : undefined);
  const [color, setColor] = useState(swatches?.[0]?.id ?? "");
  const selected = swatches?.find((c) => c.id === color);
  const img = productImage(product, color || undefined);

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden border border-paper/10 bg-white">
          <GarmentImage
            src={img}
            hex={selected?.hex}
            recolor={!product.imagesByColor?.[color]}
            alt={product.name}
          />
          {product.limited ? (
            <span className="absolute right-3 top-3 bg-ember px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
              Limited
            </span>
          ) : null}
        </div>
        <div className="mt-3">
          <h3 className="font-display text-base font-bold tracking-wide text-paper group-hover:text-ember">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-sm text-gold">{formatGbp(product.priceGbp)}</p>
        </div>
      </Link>
      {swatches ? (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Preview colours">
          {swatches.slice(0, 12).map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              aria-label={`Preview ${c.label}`}
              aria-pressed={color === c.id}
              onClick={() => setColor(c.id)}
              className={`h-6 w-6 rounded-full border ${
                color === c.id ? "border-ember ring-1 ring-ember" : "border-paper/25"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
