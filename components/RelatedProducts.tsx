import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { relatedProducts } from "@/lib/products";

export function RelatedProducts({ slug }: { slug: string }) {
  const list = relatedProducts(slug);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-extrabold">Also in the house</h2>
        <Link href="/shop" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
          Shop all
        </Link>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
