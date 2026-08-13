import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MENA 2026 booth kit",
  description: "Packing list, Lightning POS notes, and exhibitor checklist for Bitcoin MENA.",
};

const pack = [
  "MENA capsule tees — mixed sizes, numbered hang-tags",
  "Genesis tees — 2 of each size as fallback",
  "Difficulty hoodie — M/L/XL samples to wear and sell",
  "Hash Cap + Ember Dad Hat — 12 of each",
  "Foundry mugs — 8 (fragile; extra wrap)",
  "Forge totes — 30 (giveaway + paid)",
  "Sticker packs — 100",
  "QR cards to orangeforge.com/shop (scan for sizes you do not hold)",
  "Size chart A3 print",
  "Tablet + Lightning POS (OpenNode or Strike)",
  "Card reader backup (Stripe Tap to Pay on phone)",
  "Spare USBC battery, cable, EU/UK/UAE plug",
  "Banner: ORANGEFORGE — Forged, not printed.",
  "Cashless only sign: Card · Sats · USDC",
];

const pos = [
  "Primary: Lightning invoice on tablet (OpenNode hosted checkout or Strike POS).",
  "Backup: on-chain Bitcoin if Lightning liquidity fails.",
  "USDC: Coinbase Commerce link on the same tablet.",
  "Card: Stripe Tap to Pay — many floor buyers will not have a wallet ready.",
  "Never type seed phrases on event Wi-Fi. Use a hot wallet with a small float.",
  "Reconcile each night: tablet sales vs Printful/Shopify online orders.",
];

const legal = [
  "Apply for Bitcoin MENA exhibitor pass as soon as sales open (do not guess the fee here).",
  "Confirm UAE import of printed apparel with your freight forwarder or hotel receiving desk.",
  "UK VAT on remote sales: ask your accountant. Do not invent a rate.",
  "Merchant of record: DSP Capital Ventures Ltd unless you appoint another entity.",
];

export default function MenaKitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 print:max-w-none">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Internal · print this page</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Bitcoin MENA booth kit</h1>
      <p className="mt-3 font-serif text-paper/80">ADNEC, Abu Dhabi · 7–8 December 2026 · First live ORANGEFORGE booth.</p>

      <h2 className="mt-10 font-display text-2xl font-extrabold">Packing list</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 font-serif text-paper/80">
        {pack.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-extrabold">Lightning POS</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 font-serif text-paper/80">
        {pos.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-extrabold">You must still do</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 font-serif text-paper/80">
        {legal.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <p className="mt-10 font-serif text-sm text-muted">
        Bulk Printful order target: 16 October 2026 so goods can sit in the UAE by late November. Ship to hotel or freight — confirm receiving rules before you click buy.
      </p>
      <Link href="/events" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
        Back to events
      </Link>
    </div>
  );
}
