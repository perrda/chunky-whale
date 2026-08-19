import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Forge",
  description: "Grok-generated Bitcoin merch studio. Phase 1 curated. Phase 2 public generator.",
};

export default function ForgePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Studio · Phase 2</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold">The Forge</h1>
      <p className="mt-4 font-serif text-xl text-paper/85">
        After the MENA booth, anyone will be able to generate a mark, preview it on a garment, and buy it with a unique SH- ID.
      </p>
      <div className="relative my-10 aspect-square max-w-md">
        <Image src="/prints/print-difficulty.png" alt="Difficulty hash lattice print" fill className="object-cover" />
      </div>
      <ol className="space-y-4 font-serif text-paper/80">
        <li>
          <strong className="font-display text-paper">1. Pick a garment</strong> — tee, hoodie, cap, mug.
        </li>
        <li>
          <strong className="font-display text-paper">2. Grok forges four variants</strong> — print-ready, house palette only.
        </li>
        <li>
          <strong className="font-display text-paper">3. Live mockup</strong> — see it on cloth before you pay.
        </li>
        <li>
          <strong className="font-display text-paper">4. Checkout</strong> — card, Bitcoin + Lightning, or USDC. Printful prints.
        </li>
      </ol>
      <p className="mt-8 font-serif text-paper/70">
        Phase 1 (now) is the eight curated pieces so the brand can exist at events without waiting on a public generator. The xAI key goes in when you are ready — see docs/ACCOUNTS.md.
      </p>
      <Link href="/shop" className="mt-8 inline-block bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
        Shop curated drops
      </Link>
    </div>
  );
}
