import Link from "next/link";
import { site } from "@/lib/config";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 text-paper">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7931A] font-display text-lg font-extrabold leading-none text-white"
        aria-hidden
      >
        ₿
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display font-extrabold tracking-[0.12em] ${compact ? "text-base" : "text-xl"}`}
        >
          STACK<span className="text-[#F7931A]">HOUSE</span>
        </span>
        {compact ? null : (
          <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-muted">{site.strap}</span>
        )}
      </span>
    </Link>
  );
}
