"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { cartCount, useCart } from "@/lib/cart-store";
import { Logo } from "./Logo";
import { MegaNav } from "./MegaNav";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const account = useAuth((s) => s.account);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setCount(cartCount(items));
  }, [items]);

  useEffect(() => {
    void useAuth.persist.rehydrate();
    setAuthReady(true);
  }, []);

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
            className="font-display text-sm font-bold text-paper/80 hover:text-ember"
            aria-label={`Basket, ${count} items`}
          >
            Basket{count > 0 ? <span className="ml-1 text-ember">{count}</span> : null}
          </Link>
          <button
            type="button"
            className="font-display text-sm font-bold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl justify-center px-2">
          <MegaNav />
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-paper/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          <Link
            href={authReady && account ? "/account" : "/login"}
            className="mb-4 inline-block font-display text-sm font-bold sm:hidden"
          >
            {authReady && account ? "Account" : "Login"}
          </Link>
          <MegaNav mobile />
        </nav>
      ) : null}
    </header>
  );
}
