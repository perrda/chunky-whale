import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { HeroShowcase } from "@/components/HeroShowcase";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/config";
import { HOME_DOORS } from "@/lib/nav";
import { heroPool, liveProducts, productsIn } from "@/lib/products";

const catalog = liveProducts();
const featured = catalog.filter((p) => p.featured || p.trending).slice(0, 8);
const heroItems = heroPool(24).map((p) => ({
  slug: p.slug,
  name: p.name,
  image: p.image,
  priceGbp: p.priceGbp,
}));

export default function HomePage() {
  return (
    <div>
      <section className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center bg-ink px-8 py-16 text-paper md:min-h-[32rem] md:px-14">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">{site.strap}</p>
            <h1 className="mt-4 max-w-lg font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Bitcoin merch.
              <br />
              Don&apos;t miss the stack.
            </h1>
            <p className="mt-5 max-w-md font-serif text-lg text-paper/75">
              {site.tagline} Wear it, drink from it, gift it. Original designs. No altcoins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collection/wear"
                className="inline-flex items-center gap-2 bg-ember px-7 py-3 font-display text-sm font-bold text-ink"
              >
                Wear it
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border border-paper/25 px-7 py-3 font-display text-sm font-bold text-paper"
              >
                All {catalog.length} pieces
              </Link>
            </div>
          </FadeIn>
        </div>
        <HeroShowcase items={heroItems} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold">Trending</h2>
          <Link href="/collection/trending" className="font-display text-sm font-bold text-ember">
            Shop all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Three doors</h2>
        <p className="mt-2 max-w-lg font-serif text-paper/70">Wear it. Drink from it. Gift it.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {HOME_DOORS.map((c) => {
            const sample = productsIn(c.slug)[0];
            return (
              <Link
                key={c.slug}
                href={`/collection/${c.slug}`}
                className="group overflow-hidden border border-paper/10 bg-surface hover:border-ember"
              >
                <div className="relative aspect-[4/3] bg-white md:aspect-square">
                  {sample ? (
                    <Image src={sample.image} alt="" fill className="object-contain p-6" sizes="33vw" />
                  ) : null}
                </div>
                <div className="px-4 py-4">
                  <p className="font-display text-xl font-bold group-hover:text-ember">{c.label}</p>
                  <p className="mt-1 font-serif text-sm text-paper/70">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-6">
          <Link href="/shop" className="font-display text-sm font-bold text-ember">
            Shop all {catalog.length} pieces
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Notes from the stack</h2>
        <p className="mt-2 max-w-lg font-serif text-paper/70">Drops and house notes. No price calls.</p>
        <div className="mt-6 max-w-xl">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
