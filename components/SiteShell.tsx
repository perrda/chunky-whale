import Link from "next/link";
import { EventCountdown } from "./EventCountdown";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { CartHydrate } from "./CartHydrate";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartHydrate>
      <div className="min-h-screen overflow-x-hidden bg-ink">
        <div className="flex items-center justify-between gap-3 border-b border-ember/40 bg-[#111] px-4 py-2 text-white md:px-6">
          <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white sm:whitespace-normal">
            <span className="sm:hidden">Guest checkout · Card · Sats</span>
            <span className="hidden sm:inline">Guest checkout · Card · Bitcoin · USDC · USDT · Printed UK / US / EU / Asia</span>
          </p>
          <div className="flex items-center gap-4">
            <EventCountdown compact />
            <Link
              href="/events"
              className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#F7931A] sm:inline"
            >
              Event plan
            </Link>
          </div>
        </div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </CartHydrate>
  );
}
