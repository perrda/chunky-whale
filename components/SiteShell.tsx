import { Footer } from "./Footer";
import { Header } from "./Header";
import { CartHydrate } from "./CartHydrate";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartHydrate>
      <div className="min-h-screen overflow-x-hidden bg-ink">
        <div className="border-b border-ember/40 bg-[#111] px-4 py-2 text-white md:px-6">
          <p className="min-w-0 truncate text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white sm:whitespace-normal">
            <span className="sm:hidden">Guest checkout · Card · Sats · USDC · USDT</span>
            <span className="hidden sm:inline">
              Guest checkout · Card · Bitcoin · USDC · USDT · Printed UK / US / EU / Asia
            </span>
          </p>
        </div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </CartHydrate>
  );
}
