"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { cartCount, useCart } from "@/lib/cart-store";
import { SearchBox } from "./SearchBox";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collection/tees", label: "Tees" },
  { href: "/collection/family", label: "Family" },
  { href: "/collection/hoodies", label: "Hoodies" },
  { href: "/collection/hats", label: "Hats" },
  { href: "/collection/home", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/forge", label: "Forge" },
];

export function Header() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCount(cartCount(items));
  }, [items]);

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="font-display text-lg font-extrabold tracking-[0.18em] text-paper">
          ORANGEFORGE
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
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
          <Link
            href="/cart"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/80 hover:text-ember"
            aria-label={`Cart, ${count} items`}
          >
            Cart {count > 0 ? <span className="text-ember">{count}</span> : null}
          </Link>
          <button
            type="button"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-paper/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-mono text-xs uppercase tracking-[0.22em] text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
