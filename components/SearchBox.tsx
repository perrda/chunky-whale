"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({ variant = "nav" }: { variant?: "nav" | "mobile" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={variant === "mobile" ? "flex w-full" : "hidden w-full justify-center md:flex"}
    >
      <label className="sr-only" htmlFor="nav-search">
        Search
      </label>
      <input
        id="nav-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="w-full max-w-md rounded-full border border-paper/20 bg-surface px-4 py-2 font-serif text-sm text-paper placeholder:text-muted md:w-80"
      />
    </form>
  );
}
