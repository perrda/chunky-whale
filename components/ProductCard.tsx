import Link from "next/link";
import Image from "next/image";
import { colorsFor, formatGbp, HOUSE_COLORS, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const swatches = colorsFor(product) ?? (product.sizes ? HOUSE_COLORS : undefined);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-white border border-paper/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
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
        {swatches ? (
          <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Available colours">
            {swatches.slice(0, 12).map((c) => (
              <span
                key={c.id}
                title={c.label}
                className="inline-block h-3.5 w-3.5 rounded-full border border-paper/25"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
