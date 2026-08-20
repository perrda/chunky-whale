"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Something broke</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">That page did not load.</h1>
      <p className="mt-4 font-serif text-paper/75">
        Try again. If it keeps happening, stop the shop (Control+C), then SYNC — the old process sometimes serves a
        broken page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-ember px-6 py-3 font-display text-sm font-bold text-ink"
        >
          Try again
        </button>
        <Link href="/shop" className="border border-paper/30 px-6 py-3 font-display text-sm font-bold">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
