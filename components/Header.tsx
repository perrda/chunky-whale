"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { cartCount, useCart } from "@/lib/cart-store";
import { usePersistReady } from "@/lib/use-persist-ready";
import { Logo } from "./Logo";
import { MegaNav } from "./MegaNav";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const account = useAuth((s) => s.account);
  const cartReady = usePersistReady(useCart.persist);
  const authReady = usePersistReady(useAuth.persist);
  const [open, setOpen] = useState(false);
  const count = cartReady ? cartCount(items) : 0;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/95 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ember focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <Logo compact />
        <div className="hidden flex-1 justify-center md:flex">
          <Suspense fallback={null}>
            <SearchBox />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={authReady && account ? "/account" : "/login"}
            className="hidden font-display text-sm font-bold text-paper/80 hover:text-ember sm:inline"
          >
            {authReady && account ? "Account" : "Login"}
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-paper/80 hover:text-ember"
            aria-label={cartReady ? `Basket, ${count} items` : "Basket"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 8h12l-1 11H7L6 8Z" />
              <path d="M9 8V7a3 3 0 0 1 6 0v1" />
            </svg>
            <span className="hidden sm:inline">Basket</span>
            {cartReady && count > 0 ? <span className="text-ember">{count}</span> : null}
          </Link>
          <button
            type="button"
            className="font-display text-sm font-bold lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div className="hidden border-t border-paper/10 lg:block">
        <div className="mx-auto flex max-w-7xl justify-center px-2">
          <MegaNav />
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="max-h-[min(70vh,32rem)] overflow-y-auto border-t border-paper/10 px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <div className="mb-4">
            <Suspense fallback={null}>
              <SearchBox variant="mobile" />
            </Suspense>
          </div>
          <Link
            href={authReady && account ? "/account" : "/login"}
            className="mb-3 inline-block font-display text-sm font-bold sm:hidden"
          >
            {authReady && account ? "Account" : "Login"}
          </Link>
          <MegaNav mobile />
        </nav>
      ) : null}
    </header>
  );
}
