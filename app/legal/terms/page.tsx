import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Terms of service</h1>
      <p className="mt-4 font-serif text-sm text-muted">Last updated 13 August 2026.</p>
      <div className="mt-8 space-y-4 font-serif text-paper/80">
        <p>
          The site is operated by {site.merchant} unless another merchant is named at checkout. By ordering you agree to these terms.
        </p>
        <p>
          Products are described in good faith. Colours vary by screen and print run. Print-on-demand means your item is made after payment.
        </p>
        <p>
          Crypto payments are final once confirmed on the relevant network. We are not responsible for sending to the wrong address or for network fees.
        </p>
        <p>
          Nothing on this site is financial advice. Bitcoin and stablecoins are volatile. We do not promise profits, returns, or investment outcomes.
        </p>
        <p>English law. Courts of England and Wales, without limiting your mandatory consumer rights.</p>
      </div>
    </div>
  );
}
