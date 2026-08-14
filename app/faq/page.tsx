import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "What can I pay with?",
    a: "Card (Visa/Mastercard via Stripe), Bitcoin on-chain and Lightning, USDC, and USDT. All four sit as equals at checkout. Demo mode until live keys are added — then nothing is charged in demo.",
  },
  {
    q: "Do you sell altcoin merch?",
    a: "No. This is a Bitcoin house. USDC and USDT are payment rails so event buyers can settle without waiting on a card or a volatile quote. They are not product themes.",
  },
  {
    q: "Where do you ship from?",
    a: "Print-on-demand: Printful first (UK, US, EU, Japan/Australia partners), Gelato as the local-print backup, Printify/Gooten/SPOD for overflow. See Who ships.",
  },
  {
    q: "Returns?",
    a: "30 days, unused, with tags. Event-numbered capsules marked final sale and future Forge custom pieces cannot be returned unless faulty.",
  },
  {
    q: "Is this FOMO21?",
    a: "No. Different house, different marks, different payment set. We do not use their slogans or artwork.",
  },
  {
    q: "Will The Forge let me generate my own design?",
    a: "Phase 2, after the MENA booth. Today you buy the curated catalog.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">FAQ</h1>
      <dl className="mt-10 space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-display text-xl font-bold">{f.q}</dt>
            <dd className="mt-2 font-serif text-paper/80">{f.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 font-serif text-sm">
        Fulfilment map: <Link href="/fulfillment" className="text-ember">Who ships</Link>
        . Email: STACKHOUSE inbox coming
      </p>
    </div>
  );
}
