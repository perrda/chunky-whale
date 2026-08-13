"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <form onSubmit={onSubmit} className="hidden lg:block">
      <label className="sr-only" htmlFor="nav-search">
        Search
      </label>
      <input
        id="nav-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="w-36 border border-paper/15 bg-transparent px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper placeholder:text-muted"
      />
    </form>
  );
}
