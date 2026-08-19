import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Refund policy</h1>
      <p className="mt-4 font-serif text-sm text-muted">Last updated 19 August 2026. UK consumer rights are not limited by this page.</p>
      <div className="mt-8 space-y-4 font-serif text-paper/80">
        <p>
          You have <strong>30 days from delivery</strong> to return unused goods with tags on and in the original pack. Email{" "}
          <a href={`mailto:${site.email}`} className="text-ember">{site.email}</a> with your order ID. We will send a return label if we accept the return.
        </p>
        <p>
          Refunds go back by the original method where the provider allows it. Card refunds via Stripe. Bitcoin / Lightning / USDC / USDT refunds, if approved, go to an address you give us. Network fees may be deducted. We cannot reverse a confirmed chain payment ourselves.
        </p>
        <p>
          <strong>Faulty, damaged, or not as described:</strong> we replace or refund in full, including reasonable return postage. Photograph the issue before you post it back.
        </p>
        <p>
          We do not refund a change of mind on event-numbered capsules marked final sale, or on items washed, worn, or printed to a custom size you asked for — unless they are faulty.
        </p>
        <p>Sale-price differences are not refunded. Colour on screen is a guide; print runs vary slightly.</p>
        <p>
          Until payment keys are live, checkout is <strong>demo</strong> and no real money is taken — there is nothing to refund on a demo order.
        </p>
        <p>
          Full shipping times: <Link href="/shipping" className="text-ember">Shipping &amp; returns</Link>. Terms:{" "}
          <Link href="/legal/terms" className="text-ember">Terms</Link>.
        </p>
      </div>
    </div>
  );
}
