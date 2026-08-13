import Image from "next/image";
import Link from "next/link";
import { EventCountdown } from "@/components/EventCountdown";
import { FadeIn } from "@/components/FadeIn";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PaymentBadges } from "@/components/PaymentBadges";
import { ProductCard } from "@/components/ProductCard";
import { collections, products } from "@/lib/products";

const featured = products.filter((p) => p.featured);

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="/hero-forge.png"
          alt="A garment being stamped with an ember seal in a dark foundry"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold">
              {products.length} marks · UK US EU Asia print
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-paper sm:text-7xl">
              Forged,
              <br />
              not printed.
            </h1>
            <p className="mt-6 max-w-xl font-serif text-lg text-paper/85">
              Bitcoin merch house. Original Grok marks. Mid-price. Pay with card, Bitcoin + Lightning, USDC, or USDT.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="bg-ember px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
              >
                Shop the house
              </Link>
              <Link
                href="/product/mena-2026-tee"
                className="border border-paper/40 px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-paper"
              >
                MENA capsule
              </Link>
            </div>
          </FadeIn>
        </div>
        <span className="ember-pulse pointer-events-none absolute bottom-8 right-8 h-3 w-3 rounded-full bg-ember" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Equal at checkout</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Card · Sats · USDC · USDT</h2>
        <p className="mt-3 max-w-2xl font-serif text-paper/75">
          Conference floors mix wallets. No second-class payment. Demo mode until your keys are in.
        </p>
        <div className="mt-8">
          <PaymentBadges />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Collections</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Featured</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Marks that lead the house</h2>
          </div>
          <Link href="/shop" className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ember md:inline">
            All {products.length} pieces
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto my-8 max-w-6xl overflow-hidden">
        <div className="relative aspect-[16/7] min-h-64">
          <Image src="/lookbook-01.png" alt="Lookbook: tee, hoodie and cap on desert stone" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink/35" />
          <p className="absolute bottom-6 left-6 font-display text-2xl font-extrabold md:text-4xl">Look 01 · dusk stone</p>
        </div>
      </section>

      <section className="mx-auto my-16 max-w-6xl border border-paper/10 bg-surface px-4 py-12 md:grid md:grid-cols-2 md:gap-12 md:px-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">The Forge · Phase 2</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">Grok will stamp your mark.</h2>
          <p className="mt-4 font-serif text-paper/80">
            After MENA, generate four print-ready variants, preview on garment, check out with an OF- ID. Today the catalog is curated so the house can sell.
          </p>
          <Link href="/forge" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
            Studio plan
          </Link>
        </div>
        <div className="relative mt-8 aspect-[4/3] md:mt-0">
          <Image src="/prints/print-genesis.png" alt="Genesis forged hash mark" fill className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
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

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="font-display text-2xl font-extrabold">Drops and event notes</h2>
        <p className="mt-2 max-w-lg font-serif text-paper/70">Occasional. New editions and conference dates only.</p>
        <div className="mt-6 max-w-xl">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
