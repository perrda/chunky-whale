import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeChart } from "@/components/SizeChart";
import { formatGbp, getProduct, products } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const chartKind =
    product.category === "hoodies" ? "hoodies" : product.category === "tees" || product.category === "longsleeves" ? "tees" : undefined;

  return (
    <>
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      <div className="space-y-4">
        <div className="relative aspect-[4/3] bg-surface">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority sizes="50vw" />
        </div>
        {product.print ? (
          <div className="relative aspect-square max-w-sm bg-ink">
            <Image src={product.print} alt={`${product.name} print`} fill className="object-contain" />
          </div>
        ) : null}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          {product.editionId}
          {product.limited ? ` · ${product.remaining} remaining` : ""}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">{product.name}</h1>
        <p className="mt-3 font-mono text-xl text-gold">{formatGbp(product.priceGbp)}</p>
        <p className="mt-5 font-serif text-lg text-paper/85">{product.description}</p>
        <ul className="mt-6 space-y-2 font-serif text-paper/75">
          {product.details.map((d) => (
            <li key={d}>— {d}</li>
          ))}
        </ul>
        <div className="mt-8">
          <AddToCart product={product} />
        </div>
        {chartKind ? (
          <div className="mt-10 border-t border-paper/10 pt-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Size chart</h2>
            <div className="mt-3">
              <SizeChart kind={chartKind} />
            </div>
          </div>
        ) : null}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Pay with card, Bitcoin + Lightning, USDC, or USDT at checkout. Ships from UK, US, EU, or Asia hubs.
        </p>
      </div>
    </div>
    <RelatedProducts slug={product.slug} />
    </>
  );
}
