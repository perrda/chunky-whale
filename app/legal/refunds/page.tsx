import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refunds" };

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Refund policy</h1>
      <div className="mt-8 space-y-4 font-serif text-paper/80">
        <p>
          Unused goods with tags may be returned within 30 days. Refunds go back by the original method where the provider allows it.
        </p>
        <p>
          Bitcoin and Lightning refunds, if approved, are sent to an address you provide. Network fees may be deducted. We cannot reverse a confirmed chain payment ourselves.
        </p>
        <p>Sale-price differences are not refunded. Faulty goods are replaced or refunded in full.</p>
      </div>
    </div>
  );
}
