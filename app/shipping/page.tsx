import type { Metadata } from "next";
import { PRINTERS, SHIP_REGIONS } from "@/lib/shipping";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Shipping &amp; returns</h1>
      <p className="mt-4 font-serif text-paper/80">
        We print after you pay, then ship from the nearest hub. Primary printer: <strong>Printful</strong>. Backup: Gelato.
        Jewelry overflow: Printify. These times are Printful&apos;s published averages — not a promise.
      </p>
      <h2 className="mt-10 font-display text-xl font-bold">Who prints</h2>
      <ul className="mt-3 space-y-2 font-serif text-paper/80">
        {PRINTERS.map((p) => (
          <li key={p.name}>
            <strong>{p.name}.</strong> {p.role}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-xl font-bold">How long</h2>
      <p className="mt-2 font-serif text-sm text-paper/70">Fulfil 2–5 business days, then the carrier moves it.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
              <th className="py-2">Region</th>
              <th>Door to door</th>
              <th>Tee ship (first)</th>
            </tr>
          </thead>
          <tbody>
            {SHIP_REGIONS.map((r) => (
              <tr key={r.id} className="border-t border-paper/10 font-serif">
                <td className="py-2">{r.label}</td>
                <td>{r.doorToDoor}</td>
                <td>£{r.firstItemGbp.tee} est.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-serif text-sm text-paper/70">
        Embroidery can sit at the long end of 2–5 days. UAE / MENA is rest-of-world unless we bulk-ship to the booth.
      </p>
      <h2 className="mt-10 font-display text-xl font-bold">Tax</h2>
      <p className="mt-3 font-serif text-paper/80">
        UK: 20% VAT on merch when live, if DSP Capital Ventures Ltd is merchant of record. EU: VAT by destination once
        we turn on Printful DDP / your accountant&apos;s setup. US: sales tax via Stripe Tax when live. You will see it
        on the invoice — we do not hide it in the garment price.
      </p>
      <h2 className="mt-10 font-display text-xl font-bold">Returns</h2>
      <p className="mt-3 font-serif text-paper/80">
        30 days from delivery. Unused, tags on. Email hello@stackhouse.com with your order ID. Event-numbered capsules
        marked final sale cannot be returned unless faulty. UK consumer rights are not affected.
      </p>
    </div>
  );
}
