"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { SHOP_FILTERS, SHOP_MORE_FILTERS } from "@/lib/nav";
import { productsIn, type Product } from "@/lib/products";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

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
  const [sort, setSort] = useState<SortKey>("featured");

  const list = useMemo(() => {
    let next = filter === "all" ? products : productsIn(filter);
    const n = q.trim().toLowerCase();
    if (n) {
      next = next.filter(
        (p) =>
          p.name.toLowerCase().includes(n) ||
          p.tag.toLowerCase().includes(n) ||
          p.editionId.toLowerCase().includes(n) ||
          p.description.toLowerCase().includes(n),
      );
    }
    const ranked = [...next];
    if (sort === "price-asc") ranked.sort((a, b) => a.priceGbp - b.priceGbp);
    else if (sort === "price-desc") ranked.sort((a, b) => b.priceGbp - a.priceGbp);
    else if (sort === "name") ranked.sort((a, b) => a.name.localeCompare(b.name));
    else
      ranked.sort((a, b) => Number(Boolean(b.featured || b.trending)) - Number(Boolean(a.featured || a.trending)));
    return ranked;
  }, [products, filter, q, sort]);

  const moreActive = SHOP_MORE_FILTERS.some((c) => c.slug === filter);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {hideFilters ? null : (
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {SHOP_FILTERS.map((c) => (
              <FilterChip
                key={c.slug}
                active={filter === c.slug}
                onClick={() => setFilter(c.slug)}
                label={c.label}
              />
            ))}
            <label className="sr-only" htmlFor="shop-more">
              More collections
            </label>
            <select
              id="shop-more"
              value={moreActive ? filter : ""}
              onChange={(e) => setFilter(e.target.value || "all")}
              className={`border bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
                moreActive ? "border-ember text-ember" : "border-paper/20 text-paper/70"
              }`}
            >
              <option value="">More…</option>
              {SHOP_MORE_FILTERS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="block sm:w-56">
            <span className="sr-only">Search this list</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search this list…"
              className="w-full border border-paper/20 bg-ink px-3 py-2 font-mono text-sm text-paper placeholder:text-muted"
            />
          </label>
          <label className="block sm:w-48">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full border border-paper/20 bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {list.length} piece{list.length === 1 ? "" : "s"}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 font-serif text-paper/70">
          {products.length === 0
            ? "This range is not on the shelf yet. Shop everything else, or come back when the photos are ready."
            : "Nothing matches. Clear the search or pick another collection."}{" "}
          {products.length === 0 ? (
            <Link href="/shop" className="text-ember">
              Shop all
            </Link>
          ) : null}
        </p>
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
      className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
        active ? "border-ember text-ember" : "border-paper/20 text-paper/70 hover:text-paper"
      }`}
    >
      {label}
    </button>
  );
}
