import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Privacy</h1>
      <p className="mt-4 font-serif text-sm text-muted">Last updated 13 August 2026.</p>
      <div className="mt-8 space-y-4 font-serif text-paper/80">
        <p>
          We collect what we need to fulfil an order: name, email, shipping address, payment status. Card data is handled by Stripe — we do not store card numbers. Bitcoin and USDC payments are processed by OpenNode and Coinbase Commerce.
        </p>
        <p>
          Newsletter email is stored only if you opt in. You can unsubscribe from any message.
        </p>
        <p>
          Processors may include Shopify, Printful, Vercel, Resend, Stripe, OpenNode, Coinbase Commerce, and NOWPayments once those accounts are connected.
        </p>
        <p>
          Controller: {site.merchant}. Contact {site.email}. You may ask for a copy or deletion of your data, subject to legal retention of invoices.
        </p>
      </div>
    </div>
  );
}
