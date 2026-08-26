"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Something broke</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">The page tripped.</h1>
      <p className="mt-4 font-serif text-paper/75">Nothing was charged. Try again, or go back to the shop.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-ember px-6 py-3 font-display text-sm font-bold text-ink"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="border border-paper/30 px-6 py-3 font-display text-sm font-bold"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
