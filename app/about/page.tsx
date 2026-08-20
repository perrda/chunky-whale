import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">House</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold">{site.tagline}</h1>
      <p className="mt-6 font-serif text-lg text-paper/85">
        {site.name} is Bitcoin merch. The orange ₿, the 21 million, Satoshi, the white paper, the jokes Bitcoiners already
        shout on X. Original lines — we do not copy other houses.
      </p>
      <p className="mt-4 font-serif text-paper/80">
        Tees, hoodies, hats, mugs, and family cuts. Ghost-mannequin shots so you can see the print. Colourways on every
        apparel piece.
      </p>
      <p className="mt-4 font-serif text-paper/80">
        Payments are equal once keys are live: card, Bitcoin + Lightning, USDC, and USDT. Until then,
        checkout is demo and nothing is charged.
      </p>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {site.merchant}. Not financial advice. We never claim this brand will make you money.
      </p>
    </div>
  );
}
