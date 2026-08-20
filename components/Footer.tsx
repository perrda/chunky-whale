import Link from "next/link";
import { site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="font-mark text-2xl uppercase tracking-[0.08em]">
            <span className="font-semibold">Stack</span>
            <span className="font-semibold text-[#F7931A]">House</span>
          </p>
          <p className="mt-3 max-w-md font-serif text-paper/75">
            {site.tagline}
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
              <Link href="/collection/wear">Wear it</Link>
            </li>
            <li>
              <Link href="/collection/drinkware">Drink from it</Link>
            </li>
            <li>
              <Link href="/collection/mummy-daddy">Gift it</Link>
            </li>
            <li>
              <Link href="/collection/hodl">HODL</Link>
            </li>
            <li>
              <Link href="/collection/memes">Memes</Link>
            </li>
            <li>
              <Link href="/collection/tees">T-Shirts</Link>
            </li>
            <li>
              <Link href="/collection/sweatshirts">Sweatshirts</Link>
            </li>
            <li>
              <Link href="/collection/hats">Hats</Link>
            </li>
            <li>
              <Link href="/collection/swimwear">Swimwear</Link>
            </li>
            <li>
              <Link href="/collection/drinkware">Drinkware</Link>
            </li>
            <li>
              <Link href="/collection/whiskey-glasses">Whiskey glasses</Link>
            </li>
            <li>
              <Link href="/collection/shot-glasses">Shot glasses</Link>
            </li>
            <li>
              <Link href="/collection/jewelry">Jewelry</Link>
            </li>
            <li>
              <Link href="/collection/posters">Posters</Link>
            </li>
            <li>
              <Link href="/collection/kids">Kids</Link>
            </li>
            <li>
              <Link href="/collection/mummy-daddy">Mummy &amp; Daddy</Link>
            </li>
            <li>
              <Link href="/shipping">Shipping times</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">House</p>
          <ul className="mt-3 space-y-2 font-serif text-sm text-paper/80">
            <li>
              <Link href="/wholesale">Wholesale</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/sizes">Size charts</Link>
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
        {site.tagline} · {site.strap} · Not financial advice.
      </div>
    </footer>
  );
}
