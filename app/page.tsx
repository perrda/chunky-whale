import Link from "next/link";
import { EventCountdown } from "@/components/EventCountdown";
import { FadeIn } from "@/components/FadeIn";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PaymentBadges } from "@/components/PaymentBadges";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/config";
import { collections, liveProducts } from "@/lib/products";

const catalog = liveProducts();
const featured = catalog.filter((p) => p.featured).slice(0, 12);

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-paper/10">
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-14 pt-16 md:px-6 md:pt-20">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold">
              {catalog.length} pieces · ₿ on every drop
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-paper sm:text-7xl">
              <span className="text-ember">₿</span> {site.name}
            </h1>
            <p className="mt-3 font-display text-2xl font-bold text-paper/90 sm:text-3xl">{site.tagline}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-ember">{site.strap}</p>
            <p className="mt-6 max-w-xl font-serif text-lg text-paper/85">
              Bitcoin merch Bitcoiners actually want. Tees, stitched hats, hoodies, mugs, jewelry, posters. Original
              lines, classic ₿. Pay with card, Bitcoin + Lightning, USDC, or USDT.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/collection/memes"
                className="bg-ember px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
              >
                Shop the memes
              </Link>
              <Link
                href="/shop"
                className="border border-paper/40 px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
              >
                Full catalog
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">The line</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Bitcoin on the chest</h2>
          </div>
          <Link href="/shop" className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ember md:inline">
            All {catalog.length} pieces
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Collections</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collection/${c.slug}`}
              className="border border-paper/15 bg-surface px-4 py-5 hover:border-ember/50"
            >
              <p className="font-display text-lg font-bold">{c.label}</p>
              <p className="mt-1 font-serif text-sm text-paper/70">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Equal at checkout</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Card · Sats · USDC · USDT</h2>
        <p className="mt-3 max-w-2xl font-serif text-paper/75">
          Conference floors mix wallets. No second-class payment. Demo mode until your keys are in.
        </p>
        <div className="mt-8">
          <PaymentBadges />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">First live activation</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold">Bitcoin MENA</h2>
            <p className="mt-2 font-serif text-xl text-paper/80">Abu Dhabi · ADNEC · 7–8 December 2026</p>
            <Link
              href="/events"
              className="mt-6 inline-block bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
            >
              See the timetable
            </Link>
          </div>
          <EventCountdown />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Drops and event notes</h2>
        <p className="mt-2 max-w-lg font-serif text-paper/70">Occasional. New editions and conference dates only.</p>
        <div className="mt-6 max-w-xl">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
