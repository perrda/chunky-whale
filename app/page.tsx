import Link from "next/link";
import Image from "next/image";
import { EventCountdown } from "@/components/EventCountdown";
import { FadeIn } from "@/components/FadeIn";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PaymentBadges } from "@/components/PaymentBadges";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/config";
import { HOME_COLLECTIONS } from "@/lib/nav";
import { liveProducts } from "@/lib/products";

const catalog = liveProducts();
const featured = catalog.filter((p) => p.featured || p.trending).slice(0, 8);
const hero = ["hodl-tee", "21-million-tee", "stay-humble-tee"]
  .map((slug) => catalog.find((p) => p.slug === slug))
  .filter(Boolean);

export default function HomePage() {
  return (
    <div>
      <section className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#1a1a1a] px-8 py-16 text-white md:min-h-[28rem] md:px-14">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#F7931A]">{site.strap}</p>
            <h1 className="mt-4 max-w-lg font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Bitcoin tees.
              <br />
              Don&apos;t miss the stack.
            </h1>
            <p className="mt-5 max-w-md font-serif text-lg text-white/75">{site.tagline} Original designs. No altcoins.</p>
            <Link
              href="/collection/trending"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F7931A] px-7 py-3 font-display text-sm font-bold text-black"
            >
              Shop now →
            </Link>
          </FadeIn>
        </div>
        <div className="flex items-end justify-center gap-3 bg-[#ececec] px-4 py-10 md:min-h-[28rem]">
          {hero.map((p) =>
            p ? (
              <Link key={p.slug} href={`/product/${p.slug}`} className="relative aspect-[3/4] w-1/3 max-w-48">
                <Image src={p.image} alt={p.name} fill className="object-contain" sizes="20vw" />
              </Link>
            ) : null,
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <h2 className="font-display text-3xl font-extrabold">Trending</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <Link href="/shop" className="mt-10 inline-block font-display text-sm font-bold text-ember">
          Shop all {catalog.length} pieces →
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Shop by type</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/collection/${c.slug}`} className="border border-paper/10 bg-surface px-4 py-5 hover:border-ember">
              <p className="font-display text-lg font-bold">{c.label}</p>
              <p className="mt-1 font-serif text-sm text-paper/70">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <h2 className="font-display text-3xl font-extrabold">Card · Sats · USDC · USDT</h2>
        <p className="mt-3 max-w-2xl font-serif text-paper/75">
          Guest checkout. No account required. Demo until your payment keys are in.
        </p>
        <div className="mt-8">
          <PaymentBadges />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">First live booth</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold">Bitcoin MENA</h2>
            <p className="mt-2 font-serif text-xl text-paper/80">Abu Dhabi · 7–8 December 2026</p>
            <Link href="/events" className="mt-6 inline-block rounded-full bg-[#F7931A] px-5 py-3 font-display text-sm font-bold text-black">
              See the timetable
            </Link>
          </div>
          <EventCountdown />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Notes from the stack</h2>
        <p className="mt-2 max-w-lg font-serif text-paper/70">Drops and conference dates. No price calls.</p>
        <div className="mt-6 max-w-xl">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
