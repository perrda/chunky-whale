"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { cartCount, useCart } from "@/lib/cart-store";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collection/tees", label: "T-Shirts" },
  { href: "/collection/hoodies", label: "Sweatshirts" },
  { href: "/collection/women", label: "Women" },
  { href: "/collection/hats", label: "Hats" },
  { href: "/collection/kids", label: "Kids" },
  { href: "/collection/drinkware", label: "Drinkware" },
  { href: "/collection/jewelry", label: "Jewelry" },
];

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
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ember focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo compact />
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                pathname === l.href ? "text-ember" : "text-paper/70 hover:text-paper"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <SearchBox />
          </Suspense>
          <ThemeToggle />
          <Link
            href={authReady && account ? "/account" : "/login"}
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-paper/80 hover:text-ember sm:inline"
          >
            {authReady && account ? "Account" : "Login"}
          </Link>
          <Link
            href="/cart"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/80 hover:text-ember"
            aria-label={`Basket, ${count} items`}
          >
            Basket {count > 0 ? <span className="text-ember">{count}</span> : null}
          </Link>
          <button
            type="button"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-paper/10 px-4 py-4 xl:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-mono text-xs uppercase tracking-[0.18em] text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/collection/posters" className="font-mono text-xs uppercase tracking-[0.18em] text-paper">
                Posters
              </Link>
            </li>
            <li>
              <Link href="/collection/premium" className="font-mono text-xs uppercase tracking-[0.18em] text-paper">
                Premium stitch
              </Link>
            </li>
            <li>
              <Link href="/login" className="font-mono text-xs uppercase tracking-[0.18em] text-paper">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
