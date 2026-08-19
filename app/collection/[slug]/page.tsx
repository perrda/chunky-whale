import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShopCatalog } from "@/components/ShopCatalog";
import { COLLECTION_META, collectionNavFor } from "@/lib/nav";
import { productsIn } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COLLECTION_META.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTION_META.find((x) => x.slug === slug);
  return { title: c ? c.label : "Collection" };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = COLLECTION_META.find((x) => x.slug === slug);
  if (!c) notFound();
  const list = productsIn(slug);
  const nav = collectionNavFor(slug);
  const here = `/collection/${slug}`;
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Collection</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{c.label}</h1>
      <p className="mt-3 font-serif text-paper/75">{c.blurb}</p>
      {nav ? (
        <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label={`${nav.parentLabel} sections`}>
          {here !== nav.parentHref ? (
            <Link
              href={nav.parentHref}
              className="border border-paper/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 hover:text-paper"
            >
              All {nav.parentLabel}
            </Link>
          ) : null}
          {nav.children.map((child) => {
            const active = child.href === here;
            const className = `border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
              active ? "border-ember text-ember" : "border-paper/20 text-paper/70 hover:text-paper"
            }`;
            return active ? (
              <span key={child.href} className={className} aria-current="page">
                {child.label}
              </span>
            ) : (
              <Link key={child.href} href={child.href} className={className}>
                {child.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
      <div className="mt-10">
        <ShopCatalog products={list} hideFilters />
      </div>
    </div>
  );
}
