"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatGbp, searchProducts } from "@/lib/products";

export function SearchBox({ variant = "nav" }: { variant?: "nav" | "mobile" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const id = variant === "mobile" ? "mobile-search" : "nav-search";

  const hits = useMemo(() => (q.trim().length < 2 ? [] : searchProducts(q).slice(0, 6)), [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    setOpen(false);
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <div ref={wrap} className={variant === "mobile" ? "relative w-full" : "relative hidden w-full justify-center md:flex"}>
      <form onSubmit={onSubmit} className="flex w-full justify-center">
        <label className="sr-only" htmlFor={id}>
          Search
        </label>
        <input
          id={id}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search marks…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && hits.length > 0}
          aria-controls={`${id}-suggest`}
          aria-autocomplete="list"
          className="w-full max-w-md rounded-full border border-paper/20 bg-surface px-4 py-2 font-serif text-sm text-paper placeholder:text-muted md:w-80"
        />
      </form>
      {open && hits.length > 0 ? (
        <ul
          id={`${id}-suggest`}
          className="absolute left-1/2 top-full z-50 mt-1 w-full max-w-md -translate-x-1/2 border border-paper/15 bg-ink py-1 shadow-lg md:w-80"
          role="listbox"
        >
          {hits.map((p) => (
            <li key={p.slug} role="option" aria-selected="false">
              <Link
                href={`/product/${p.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                <span className="truncate font-display text-sm font-bold">{p.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-gold">{formatGbp(p.priceGbp)}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="w-full px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ember"
              onClick={() => {
                setOpen(false);
                router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
              }}
            >
              See all matches
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
