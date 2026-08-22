"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import {
  collectionFor,
  colorsFor,
  defaultColorId,
  fitNote,
  formatGbp,
  needsRecolor,
  productImage,
  productKindLabel,
  type Product,
} from "@/lib/products";
import { SHIP_REGIONS } from "@/lib/shipping";
import { ColorChoiceGrid } from "./ColorSwatches";
import { GarmentImage } from "./GarmentImage";
import { SizeChart } from "./SizeChart";

export function ProductView({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const colors = useMemo(() => colorsFor(product), [product]);
  const [color, setColor] = useState(defaultColorId(product));
  const [size, setSize] = useState(product.sizes?.[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [shot, setShot] = useState<"front" | "print">("front");
  const remaining = product.limited ? Math.max(0, product.remaining ?? 0) : 20;
  const soldOut = Boolean(product.limited && remaining <= 0);
  const qtyMax = Math.max(1, Math.min(20, remaining || 20));
  const img = productImage(product, color || undefined);
  const printSrc = product.print;
  const showingPrint = shot === "print" && Boolean(printSrc);
  const displaySrc = showingPrint ? printSrc! : img;
  const displayRecolor = !showingPrint && needsRecolor(product, color);
  const hex = colors?.find((c) => c.id === color)?.hex;
  const fit = fitNote(product);
  const colorName = colors?.find((c) => c.id === color)?.label ?? color;
  const crumb = collectionFor(product);
  const chartKind =
    product.category === "hoodies"
      ? "hoodies"
      : product.category === "tees" || product.category === "longsleeves"
        ? "tees"
        : undefined;

  useEffect(() => {
    if (!zoom) return;
    const close = document.getElementById("product-zoom-close");
    close?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key !== "Tab") return;
      e.preventDefault();
      close?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom]);

  function onAdd() {
    add({
      slug: product.slug,
      size: product.sizes ? size : undefined,
      color: colors ? color : undefined,
      qty,
    });
    setAdded(true);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      <div className="space-y-4">
        <nav className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-ember">
            Shop
          </Link>
          <span className="px-2">/</span>
          <Link href={crumb.href} className="hover:text-ember">
            {crumb.label}
          </Link>
          <span className="px-2">/</span>
          <span className="text-paper/70">{product.shortName}</span>
        </nav>
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="relative block aspect-square w-full overflow-hidden bg-white"
          aria-label="Enlarge photo"
        >
          <GarmentImage
            key={`${displaySrc}-${color}-${shot}`}
            src={displaySrc}
            hex={hex}
            recolor={displayRecolor}
            alt={`${product.name}${color ? ` in ${colorName}` : ""}${showingPrint ? " print" : ""}`}
            className={shot === "print" && !printSrc ? "scale-125" : undefined}
          />
          <span className="absolute bottom-3 right-3 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
            Tap to zoom
          </span>
        </button>
        <div className="flex gap-2" aria-label="Product photos">
          <button
            type="button"
            onClick={() => setShot("front")}
            aria-pressed={shot === "front"}
            className={`relative h-16 w-16 overflow-hidden bg-white ${
              shot === "front" ? "ring-2 ring-ember" : "ring-1 ring-paper/15"
            }`}
          >
            <GarmentImage src={img} hex={hex} recolor={needsRecolor(product, color)} alt="" />
            <span className="sr-only">Front</span>
          </button>
          <button
            type="button"
            onClick={() => setShot("print")}
            aria-pressed={shot === "print"}
            className={`relative h-16 w-16 overflow-hidden bg-white ${
              shot === "print" ? "ring-2 ring-ember" : "ring-1 ring-paper/15"
            }`}
          >
            <GarmentImage
              src={printSrc ?? img}
              hex={printSrc ? undefined : hex}
              recolor={!printSrc && needsRecolor(product, color)}
              alt=""
              className="scale-150"
            />
            <span className="sr-only">Print close-up</span>
          </button>
        </div>
        {colors && color ? (
          <p className="font-serif text-sm text-paper/70">
            Showing <strong>{colorName}</strong>
            {!needsRecolor(product, color) ? " (studio photo)." : "."}
          </p>
        ) : null}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          {productKindLabel(product)}
          {product.editionId ? ` · ${product.editionId}` : ""}
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
              <ColorChoiceGrid colors={colors} value={color} onChange={setColor} name="pdp-color" />
            </fieldset>
          ) : null}
          <p className="font-serif text-sm text-paper/80">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">Fit · </span>
            {fit}
          </p>
          {product.sizes ? (
            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    aria-pressed={size === s.id}
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
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Quantity</span>
            <input
              type="number"
              min={1}
              max={qtyMax}
              inputMode="numeric"
              value={qty}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (!Number.isFinite(n)) return;
                setQty(Math.min(qtyMax, Math.max(1, Math.round(n))));
              }}
              className="mt-2 w-20 border border-paper/20 bg-ink px-3 py-2 font-mono text-sm text-paper"
            />
          </label>
          <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex flex-col gap-3 border-t border-paper/10 bg-ink/95 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <div className="flex items-center justify-between gap-3 sm:hidden">
              <p className="truncate font-display text-sm font-bold">{product.shortName}</p>
              <p className="shrink-0 font-mono text-sm text-gold">{formatGbp(product.priceGbp)}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAdd}
              disabled={soldOut}
              className="bg-ember px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink disabled:opacity-50"
            >
              {soldOut ? "Sold out" : added ? "Added to basket" : "Add to basket"}
            </button>
            {added ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/cart")}
                  className="border border-paper/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
                >
                  View basket
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="border border-paper/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
                >
                  Checkout
                </button>
              </>
            ) : null}
            </div>
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
          Not financial advice.
        </p>
      </div>

      {zoom ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product photo"
          onClick={() => setZoom(false)}
        >
          <div className="relative aspect-square w-full max-w-3xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <GarmentImage
              src={displaySrc}
              hex={hex}
              recolor={displayRecolor}
              alt={product.name}
            />
            <button
              id="product-zoom-close"
              type="button"
              onClick={() => setZoom(false)}
              className="absolute right-3 top-3 bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
