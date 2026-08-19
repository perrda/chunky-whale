import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { RelatedProducts } from "@/components/RelatedProducts";
import { getProduct, liveProducts, RETIRED_SLUGS } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return liveProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || p.retired || RETIRED_SLUGS.has(slug)) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.retired || RETIRED_SLUGS.has(slug)) notFound();

  return (
    <>
      <ProductView product={product} />
      <RelatedProducts slug={product.slug} />
    </>
  );
}
