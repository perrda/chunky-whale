import type { Metadata } from "next";
import { ShopCatalog } from "@/components/ShopCatalog";
import { liveProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Bitcoin merch",
  description: "HARD MONEY CO. Bitcoin merch: meme tees, ₿, hoodies, hats. Pay with card, BTC, USDC, or USDT.",
};

type Props = { searchParams: Promise<{ q?: string; cat?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { q, cat } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Catalog</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Bitcoin merch</h1>
      <p className="mt-3 max-w-2xl font-serif text-paper/75">
        The memes, the ₿, the 21 million. Tees, hoodies, hats, drinkware, jewelry, posters. Mid-price. Printed near the buyer.
      </p>
      <div className="mt-10">
        <ShopCatalog products={liveProducts()} initialFilter={cat ?? "all"} initialQ={q ?? ""} />
      </div>
    </div>
  );
}
