import type { Metadata } from "next";
import { ShopCatalog } from "@/components/ShopCatalog";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Bitcoin merch",
  description: "ORANGEFORGE Bitcoin merch: tees, hoodies, hats, mugs, home. Pay with card, BTC, USDC, or USDT.",
};

type Props = { searchParams: Promise<{ q?: string; cat?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { q, cat } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Catalog</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">The house collection</h1>
      <p className="mt-3 max-w-2xl font-serif text-paper/75">
        Original marks across tees, long sleeves, hoodies, hats, and home. Mid-price. Printed near the buyer in the UK, US, Europe, or Asia. Not a slogan dump.
      </p>
      <div className="mt-10">
        <ShopCatalog products={products} initialFilter={cat ?? "all"} initialQ={q ?? ""} />
      </div>
    </div>
  );
}
