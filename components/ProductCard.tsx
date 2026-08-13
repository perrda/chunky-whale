import Link from "next/link";
import Image from "next/image";
import { formatGbp, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
          {product.tag}
        </span>
        {product.limited ? (
          <span className="absolute right-3 top-3 bg-ember px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
            Limited
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold tracking-wide">{product.name}</h3>
        <p className="font-mono text-sm text-gold">{formatGbp(product.priceGbp)}</p>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{product.editionId}</p>
    </Link>
  );
}
