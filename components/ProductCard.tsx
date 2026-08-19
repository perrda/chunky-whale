"use client";

import Link from "next/link";
import { useState } from "react";
import { colorsFor, formatGbp, productImage, type Product } from "@/lib/products";
import { ColorSwatches } from "./ColorSwatches";
import { GarmentImage } from "./GarmentImage";

export function ProductCard({ product }: { product: Product }) {
  const swatches = colorsFor(product);
  const [color, setColor] = useState(swatches?.[0]?.id ?? "");
  const selected = swatches?.find((c) => c.id === color);
  const img = productImage(product, color || undefined);

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white">
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
          {product.featured && !product.limited ? (
            <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
              Featured
            </span>
          ) : null}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-ink/90 py-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            View
          </span>
        </div>
        <div className="mt-3">
          <h3 className="font-display text-base font-bold tracking-wide text-paper group-hover:text-ember">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-sm text-gold">{formatGbp(product.priceGbp)}</p>
        </div>
      </Link>
      {swatches ? <ColorSwatches colors={swatches} value={color} onChange={setColor} /> : null}
    </div>
  );
}
