import { Footer } from "./Footer";
import { Header } from "./Header";
import { CartHydrate } from "./CartHydrate";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartHydrate>
      <div className="min-h-screen overflow-x-hidden bg-ink">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </CartHydrate>
  );
}
