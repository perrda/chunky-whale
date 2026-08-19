"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { colorsFor, productImage, type Product } from "@/lib/products";
import { SHIP_REGIONS } from "@/lib/shipping";
import { GarmentImage } from "./GarmentImage";
import { SizeChart } from "./SizeChart";

export function ProductView({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const colors = useMemo(() => colorsFor(product), [product]);
  const [color, setColor] = useState(colors?.[0]?.id ?? "");
  const [size, setSize] = useState(product.sizes?.[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const img = productImage(product, color || undefined);
  const chartKind =
    product.category === "hoodies"
      ? "hoodies"
      : product.category === "tees" || product.category === "longsleeves"
        ? "tees"
        : undefined;

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
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden bg-white">
          <GarmentImage
            key={`${img}-${color}`}
            src={img}
            hex={colors?.find((c) => c.id === color)?.hex}
            recolor={!product.imagesByColor?.[color]}
            alt={`${product.name}${color ? ` in ${colors?.find((c) => c.id === color)?.label ?? color}` : ""}`}
          />
        </div>
        {colors && color ? (
          <p className="font-serif text-sm text-paper/70">
            Showing <strong>{colors.find((c) => c.id === color)?.label}</strong>
            {product.imagesByColor?.[color] ? " (studio photo)." : "."}
          </p>
        ) : null}
        {colors && colors.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-white ${
                  color === c.id ? "border-ember" : "border-paper/20"
                }`}
                aria-label={c.label}
              >
                <GarmentImage
                  src={productImage(product, c.id)}
                  hex={c.hex}
                  recolor={!product.imagesByColor?.[c.id]}
                  alt=""
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          {product.editionId}
          {product.finish === "embroidery" ? " · Stitched" : ""}
          {product.limited ? ` · ${product.remaining} remaining` : ""}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">{product.name}</h1>
        <p className="mt-3 font-mono text-xl text-gold">
          {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(product.priceGbp)}
        </p>
        <p className="mt-5 font-serif text-lg text-paper/85">{product.description}</p>
        <ul className="mt-6 space-y-2 font-serif text-paper/75">
          {product.details.map((d) => (
            <li key={d}>— {d}</li>
          ))}
        </ul>

        <div className="mt-8 space-y-4">
          {colors ? (
            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Colour</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-2 border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] ${
                      color === c.id ? "border-ember text-ember" : "border-paper/20 text-paper/80"
                    }`}
                  >
                    <span className="inline-block h-3 w-3 rounded-full border border-paper/30" style={{ background: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}
          {product.sizes ? (
            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] ${
                      size === s.id ? "border-ember text-ember" : "border-paper/20 text-paper/80"
                    }`}
                  >
                    {s.label}
                  </button>
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
              {added ? "Added to basket" : "Add to basket"}
            </button>
            {added ? (
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="border border-paper/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
              >
                Go to checkout
              </button>
            ) : null}
          </div>
        </div>

        {chartKind ? (
          <div className="mt-10 border-t border-paper/10 pt-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Size chart</h2>
            <div className="mt-3">
              <SizeChart kind={chartKind} />
            </div>
          </div>
        ) : null}

        <div className="mt-10 border-t border-paper/10 pt-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Shipping (Printful)</h2>
          <p className="mt-2 font-serif text-sm text-paper/75">
            Printed after you pay, then shipped from the nearest hub. Estimates, not promises.
          </p>
          <ul className="mt-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/70">
            {SHIP_REGIONS.map((r) => (
              <li key={r.id}>
                {r.label}: {r.doorToDoor}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Pay with card, Bitcoin + Lightning, USDC, or USDT. UK VAT at checkout when live. Not financial advice.
        </p>
      </div>
    </div>
  );
}
