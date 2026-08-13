import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopCatalog } from "@/components/ShopCatalog";
import { collections, productsIn } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  return { title: c ? c.label : "Collection" };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  const list = productsIn(slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Collection</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{c.label}</h1>
      <p className="mt-3 font-serif text-paper/75">{c.blurb}</p>
      <div className="mt-10">
        <ShopCatalog products={list} hideFilters />
      </div>
    </div>
  );
}
