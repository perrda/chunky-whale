import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { getProduct, markKey, relatedProducts } from "@/lib/products";

export function RelatedProducts({ slug }: { slug: string }) {
  const list = relatedProducts(slug);
  if (!list.length) return null;
  const p = getProduct(slug);
  const mark = p ? markKey(p) : "";
  const sameMark = p ? list.some((x) => markKey(x) === mark) : false;
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-extrabold">
          {sameMark ? "Same line, other pieces" : "Also in the drop"}
        </h2>
        <Link href="/shop" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
          Shop all
        </Link>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((item) => (
          <ProductCard key={item.slug} product={item} />
        ))}
      </div>
    </section>
  );
}
