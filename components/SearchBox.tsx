"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatGbp, searchProducts } from "@/lib/products";

export function SearchBox({ variant = "nav" }: { variant?: "nav" | "mobile" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const id = variant === "mobile" ? "mobile-search" : "nav-search";

  const hits = useMemo(() => (q.trim().length < 2 ? [] : searchProducts(q).slice(0, 6)), [q]);
  const optionCount = hits.length + (hits.length > 0 ? 1 : 0);

  useEffect(() => {
    setActive(-1);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goShop() {
    const next = q.trim();
    setOpen(false);
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (active >= 0 && active < hits.length) {
      setOpen(false);
      router.push(`/product/${hits[active].slug}`);
      return;
    }
    goShop();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp") && hits.length) {
      setOpen(true);
    }
    if (!open || !optionCount) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % optionCount);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? optionCount - 1 : i - 1));
    }
  }

  return (
    <div ref={wrap} className="relative flex w-full justify-center">
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
          onKeyDown={onKeyDown}
          placeholder="Search marks…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && hits.length > 0}
          aria-controls={`${id}-suggest`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          className="w-full max-w-[11rem] rounded-full border border-paper/20 bg-surface px-3 py-1.5 font-serif text-sm text-paper placeholder:text-muted sm:max-w-md sm:px-4 sm:py-2 md:w-80"
        />
      </form>
      {open && hits.length > 0 ? (
        <ul
          id={`${id}-suggest`}
          className="absolute left-1/2 top-full z-50 mt-1 w-full max-w-md -translate-x-1/2 border border-paper/15 bg-ink py-1 shadow-lg md:w-80"
          role="listbox"
        >
          {hits.map((p, i) => (
            <li key={p.slug} id={`${id}-opt-${i}`} role="option" aria-selected={active === i}>
              <Link
                href={`/product/${p.slug}`}
                className={`flex items-center justify-between gap-3 px-4 py-2 hover:bg-surface ${
                  active === i ? "bg-surface" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <span className="truncate font-display text-sm font-bold">{p.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-gold">{formatGbp(p.priceGbp)}</span>
              </Link>
            </li>
          ))}
          <li id={`${id}-opt-${hits.length}`} role="option" aria-selected={active === hits.length}>
            <button
              type="button"
              className={`w-full px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ember ${
                active === hits.length ? "bg-surface" : ""
              }`}
              onClick={goShop}
            >
              See all matches
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
