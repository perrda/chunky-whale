import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Terms of service</h1>
      <p className="mt-4 font-serif text-sm text-muted">Last updated 19 August 2026.</p>
      <div className="mt-8 space-y-4 font-serif text-paper/80">
        <p>
          The site is operated by {site.merchant} unless another merchant is named at checkout. By ordering you agree to these terms.
        </p>
        <p>
          Products are print-on-demand. We make them after payment clears. Descriptions are in good faith. Colours vary by screen, blank, and print run. The product photo updates to the colour you pick; the printed garment can still differ slightly from the screen.
        </p>
        <p>
          Prices are in GBP unless shown otherwise. UK VAT and destination tax/duty may be added at live checkout. Shipping estimates are on{" "}
          <Link href="/shipping" className="text-ember">Shipping</Link> and are not a guaranteed arrival date.
        </p>
        <p>
          You may pay by card (Stripe), Bitcoin on-chain or Lightning (OpenNode), USDC (Coinbase Commerce), or USDT (NOWPayments) once those accounts are live. Until keys are added, checkout is demo and does not take money.
        </p>
        <p>
          Crypto payments are final once confirmed on the relevant network. We are not responsible for sending to the wrong address or for network fees. Do not type a seed phrase on this site or on event Wi‑Fi.
        </p>
        <p>
          We do not ship to sanctioned regions. Live checkout will block those destinations.
        </p>
        <p>
          Nothing on this site is financial advice. Bitcoin and stablecoins are volatile. We do not promise profits, returns, or investment outcomes. Garments are merch — not an investment product.
        </p>
        <p>
          Returns: <Link href="/legal/refunds" className="text-ember">Refund policy</Link>. Privacy:{" "}
          <Link href="/legal/privacy" className="text-ember">Privacy</Link>.
        </p>
        <p>English law. Courts of England and Wales, without limiting your mandatory consumer rights.</p>
      </div>
    </div>
  );
}
