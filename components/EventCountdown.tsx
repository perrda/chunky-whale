"use client";

import { useEffect, useState } from "react";
import { MENA_START } from "@/lib/events";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
  };
}

export function EventCountdown({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(MENA_START).getTime();
  const p = now === null ? { d: "—", h: "—", m: "—" } : parts(target - now);

  if (compact) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold" aria-live="polite">
        {p.d}d {p.h}h {p.m}m
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3" aria-label="Countdown to Bitcoin MENA">
      {[
        [p.d, "Days"],
        [p.h, "Hours"],
        [p.m, "Minutes"],
      ].map(([v, l]) => (
        <div key={String(l)} className="border border-paper/15 bg-surface px-4 py-5 text-center">
          <p className="font-display text-3xl font-extrabold text-paper">{v}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{l}</p>
        </div>
      ))}
    </div>
  );
}
