import Link from "next/link";
import { site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="font-display text-xl font-extrabold tracking-[0.16em]">ORANGEFORGE</p>
          <p className="mt-3 max-w-md font-serif text-paper/75">
            Bitcoin merch, forged not printed. Original Grok designs. Pay with card, Bitcoin + Lightning, USDC, or USDT.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {site.merchant} · {site.merchantNote}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Shop</p>
          <ul className="mt-3 space-y-2 font-serif text-sm text-paper/80">
            <li>
              <Link href="/shop">All drops</Link>
            </li>
            <li>
              <Link href="/collection/tees">T-Shirts</Link>
            </li>
            <li>
              <Link href="/collection/family">Family</Link>
            </li>
            <li>
              <Link href="/fulfillment">Who ships</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">House</p>
          <ul className="mt-3 space-y-2 font-serif text-sm text-paper/80">
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/shipping">Shipping &amp; returns</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms</Link>
            </li>
            <li>
              <Link href="/legal/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/legal/refunds">Refunds</Link>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Not financial advice. No profit claims. Wear the work.
      </div>
    </footer>
  );
}
