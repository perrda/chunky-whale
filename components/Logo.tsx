import Link from "next/link";
import { site } from "@/lib/config";

export function Logo({ compact = false }: { compact?: boolean }) {
  const box = compact ? "h-10 w-10" : "h-12 w-12";
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 text-paper" aria-label={`${site.name} home`}>
      <span className={`relative shrink-0 ${box}`}>
        <img
          src="/brand/chunky-whale-logo.png"
          alt=""
          className="logo-mark logo-mark-light h-full w-full object-contain"
        />
        <img
          src="/brand/chunky-whale-dark.png"
          alt=""
          className="logo-mark logo-mark-dark absolute inset-0 h-full w-full object-contain"
        />
      </span>
      <span className="leading-none">
        <span
          className={`block font-mark uppercase ${compact ? "text-[1.35rem] tracking-[0.06em]" : "text-[1.7rem] tracking-[0.08em]"}`}
        >
          <span className="font-semibold text-paper">Chunky </span>
          <span className="font-semibold text-[#F7931A]">Whale</span>
        </span>
        {compact ? null : (
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
            Bitcoin merch
          </span>
        )}
      </span>
    </Link>
  );
}
