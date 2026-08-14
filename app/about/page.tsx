import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">House</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold">Forged, not printed.</h1>
      <p className="mt-6 font-serif text-lg text-paper/85">
        STACKHOUSE is a Bitcoin merch house. We make a short line of original garments and objects — Grok-forged marks, heavy cloth, ember as a seal rather than a shout.
      </p>
      <p className="mt-4 font-serif text-paper/80">
        We are not a slogan catalog. We do not copy other houses. We sell tees, hoodies, hats, mugs, totes, and marks you can put on a laptop or a booth table.
      </p>
      <p className="mt-4 font-serif text-paper/80">
        Payments are equal: card, Bitcoin + Lightning, and USDC. The first live floor is Bitcoin MENA in Abu Dhabi, 7–8 December 2026.
      </p>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {site.merchant}. Not financial advice. We never claim this brand will make you money.
      </p>
    </div>
  );
}
