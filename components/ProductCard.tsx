"use client";

import Link from "next/link";
import { useState } from "react";
import { colorsFor, defaultColorId, formatGbp, needsRecolor, productImage, productKindLabel, type Product } from "@/lib/products";
import { ColorSwatches } from "./ColorSwatches";
import { GarmentImage } from "./GarmentImage";

export function ProductCard({ product }: { product: Product }) {
  const swatches = colorsFor(product);
  const [color, setColor] = useState(defaultColorId(product));
  const selected = swatches?.find((c) => c.id === color);
  const img = productImage(product, color || undefined);

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white">
          <GarmentImage
            src={img}
            hex={selected?.hex}
            recolor={needsRecolor(product, color)}
            alt={product.name}
          />
          {product.limited ? (
            <span className="absolute right-3 top-3 bg-ember px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
              Limited
            </span>
          ) : null}
        </div>
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{productKindLabel(product)}</p>
          <h3 className="mt-1 font-display text-base font-bold tracking-wide text-paper group-hover:text-ember">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-sm text-gold">{formatGbp(product.priceGbp)}</p>
        </div>
      </Link>
      {swatches ? <ColorSwatches colors={swatches} value={color} onChange={setColor} /> : null}
    </div>
  );
}
