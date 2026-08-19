import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { RelatedProducts } from "@/components/RelatedProducts";
import { getProduct, isLiveProduct, liveProducts } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return liveProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || !isLiveProduct(slug)) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLiveProduct(slug)) notFound();

  return (
    <>
      <ProductView product={product} />
      <RelatedProducts slug={product.slug} />
    </>
  );
}
