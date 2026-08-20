import Image from "next/image";
import Link from "next/link";
import { FEATURED_LINES, lineKey, lineMeta } from "@/lib/design-line";
import { productKindLabel, sameLine, type Product } from "@/lib/products";

export function LineStrip({ product }: { product: Product }) {
  const others = sameLine(product.slug);
  if (!others.length) return null;
  const key = lineKey(product);
  const meta = lineMeta(key);
  const featured = FEATURED_LINES.some((l) => l.slug === key);
  const shown = others.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">This line</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{meta.label}</h2>
          <p className="mt-1 font-serif text-sm text-paper/70">Same joke, another object.</p>
        </div>
        {featured ? (
          <Link
            href={`/collection/${key}`}
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ember"
          >
            Shop the line
          </Link>
        ) : null}
      </div>
      <ul className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {shown.map((p) => (
          <li key={p.slug} className="w-36 shrink-0 sm:w-40">
            <Link href={`/product/${p.slug}`} className="group block">
              <div className="relative aspect-square bg-white">
                <Image src={p.image} alt="" fill className="object-contain p-2" sizes="160px" />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {productKindLabel(p)}
              </p>
              <p className="font-display text-sm font-bold group-hover:text-ember">{p.shortName}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
