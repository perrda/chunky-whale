import Link from "next/link";
import { site } from "@/lib/config";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-paper">
      <span className="font-display text-xl font-extrabold leading-none text-ember" aria-hidden>
        ₿
      </span>
      <span
        className={`font-display font-extrabold tracking-[0.16em] ${
          compact ? "text-sm" : "text-lg"
        }`}
      >
        {site.name}
      </span>
    </Link>
  );
}
