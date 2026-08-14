import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Shipping &amp; returns</h1>
      <h2 className="mt-8 font-display text-xl font-bold">Shipping</h2>
      <p className="mt-3 font-serif text-paper/80">
        Printful prints after payment clears, then ships from the nearest hub (US, EU, Asia). Times vary by country and carrier. You will see an estimate at checkout once live rates are connected.
      </p>
      <p className="mt-3 font-serif text-paper/80">
        We do not ship to sanctioned regions. The live checkout will block those destinations.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold">Returns</h2>
      <p className="mt-3 font-serif text-paper/80">
        30 days from delivery. Item unused, tags on, original pack. Contact us with your order ID. We will send a return label if we accept the return.
      </p>
      <p className="mt-3 font-serif text-paper/80">
        Personalised Forge designs (phase 2) and event-numbered capsules marked final sale cannot be returned unless faulty.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold">Faulty goods</h2>
      <p className="mt-3 font-serif text-paper/80">
        If a print or garment is defective, photograph it and write to us. We replace or refund. UK consumer rights are not affected.
      </p>
    </div>
  );
}
