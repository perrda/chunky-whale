"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatGbp } from "@/lib/products";
import { GarmentImage } from "./GarmentImage";

export type HeroItem = {
  slug: string;
  name: string;
  image: string;
  priceGbp: number;
};

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function HeroShowcase({ items }: { items: HeroItem[] }) {
  const [six, setSix] = useState(items.slice(0, 6));

  useEffect(() => {
    setSix(shuffle(items).slice(0, 6));
  }, [items]);

  return (
    <div className="grid h-full min-h-[22rem] grid-cols-2 grid-rows-3 gap-2 bg-[#ececec] p-3 sm:grid-cols-3 sm:grid-rows-2 md:min-h-[32rem] md:p-4">
      {six.map((p) => (
        <Link
          key={p.slug}
          href={`/product/${p.slug}`}
          className="group flex flex-col bg-white p-2 transition-transform hover:-translate-y-0.5"
        >
          <div className="aspect-square">
            <GarmentImage src={p.image} alt={p.name} />
          </div>
          <p className="mt-2 line-clamp-1 font-display text-[11px] font-bold text-black sm:text-xs">{p.name}</p>
          <p className="font-mono text-[10px] text-black/55">{formatGbp(p.priceGbp)}</p>
        </Link>
      ))}
    </div>
  );
}
