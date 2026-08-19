"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { HOME_COLLECTIONS } from "@/lib/nav";
import { type Product } from "@/lib/products";

export function ShopCatalog({
  products,
  initialFilter = "all",
  initialQ = "",
  hideFilters = false,
}: {
  products: Product[];
  initialFilter?: string;
  initialQ?: string;
  hideFilters?: boolean;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [q, setQ] = useState(initialQ);

  const list = useMemo(() => {
    let next = products;
    if (filter === "events") next = next.filter((p) => p.event);
    else if (filter === "family" || filter === "kids")
      next = next.filter((p) => p.cut === "youth" || p.cut === "toddler" || p.cut === "infant");
    else if (filter === "women") next = next.filter((p) => p.cut === "women");
    else if (filter === "memes") next = next.filter((p) => p.tag === "Meme");
    else if (filter === "premium") next = next.filter((p) => p.finish === "embroidery" || p.tag === "Premium");
    else if (filter === "sweatshirts") next = next.filter((p) => p.category === "hoodies");
    else if (filter !== "all") next = next.filter((p) => p.category === filter);
    const n = q.trim().toLowerCase();
    if (n) {
      next = next.filter(
        (p) =>
          p.name.toLowerCase().includes(n) ||
          p.tag.toLowerCase().includes(n) ||
          p.editionId.toLowerCase().includes(n),
      );
    }
    return next;
  }, [products, filter, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {hideFilters ? null : (
          <div className="flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {HOME_COLLECTIONS.map((c) => (
              <FilterChip key={c.slug} active={filter === c.slug} onClick={() => setFilter(c.slug)} label={c.label} />
            ))}
          </div>
        )}
        <label className="block md:w-64">
          <span className="sr-only">Search the shop</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search marks…"
            className="w-full border border-paper/20 bg-ink px-3 py-2 font-mono text-sm text-paper placeholder:text-muted"
          />
        </label>
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {list.length} piece{list.length === 1 ? "" : "s"}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 font-serif text-paper/70">Nothing matches. Clear the search or pick another collection.</p>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-mono text-[10px] uppercase tracking-[0.16em] border px-3 py-2 ${
        active ? "border-ember text-ember" : "border-paper/20 text-paper/70 hover:text-paper"
      }`}
    >
      {label}
    </button>
  );
}
