import type { Metadata } from "next";
import Link from "next/link";
import { partners, regionPlan } from "@/lib/fulfillment";

export const metadata: Metadata = {
  title: "Dropshipping partners",
  description: "Who prints and ships STACKHOUSE in the UK, US, Europe, and Asia.",
};

export default function FulfillmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Operations</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Who ships the house</h1>
      <p className="mt-4 font-serif text-paper/80">
        You do not hold stock for online orders. A printer near the buyer makes the piece after payment. That is dropshipping. Quality still depends on samples — order one of each SKU to Bangkok before you take money.
      </p>
      <p className="mt-3 font-serif text-sm text-muted">
        This is not a promise of sales volume. It is the fulfilment map so the shop can go live without a warehouse.
      </p>

      <h2 className="mt-12 font-display text-2xl font-extrabold">Companies to work with</h2>
      <ul className="mt-6 space-y-6">
        {partners.map((p) => (
          <li key={p.name} className="border border-paper/15 bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">{p.status}</p>
            <p className="mt-1 font-display text-xl font-bold">
              <a href={p.url} className="hover:text-ember" target="_blank" rel="noreferrer">
                {p.name}
              </a>
            </p>
            <p className="font-serif text-sm text-gold">{p.role}</p>
            <p className="mt-2 font-serif text-paper/80">{p.regions}</p>
            <p className="mt-2 font-serif text-paper/70">{p.useFor}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-2xl font-extrabold">By region</h2>
      <ul className="mt-6 space-y-4">
        {regionPlan.map((r) => (
          <li key={r.region}>
            <p className="font-display font-bold">{r.region}</p>
            <p className="font-serif text-paper/80">{r.printer}</p>
            <p className="font-serif text-sm text-muted">{r.note}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 font-serif">
        Copy-paste account steps:{" "}
        <Link href="/faq" className="text-ember">
          FAQ
        </Link>{" "}
        and the file docs/ACCOUNTS.md in the project.
      </p>
    </div>
  );
}
