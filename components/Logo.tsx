import Link from "next/link";

function BitcoinMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sh-coin" x1="12" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC56A" />
          <stop offset="0.45" stopColor="#F7931A" />
          <stop offset="1" stopColor="#C45E00" />
        </linearGradient>
        <linearGradient id="sh-coin-edge" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE0A3" />
          <stop offset="1" stopColor="#9A4A00" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#sh-coin-edge)" />
      <circle cx="32" cy="32" r="26.5" fill="url(#sh-coin)" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="#F4D19A" strokeWidth="1.2" opacity="0.55" />
      <path
        fill="#fff"
        d="M36.9 28.7c1.9-1.2 2.8-2.9 2.4-5.2-.5-3.1-3.1-4.3-6.8-4.6V15h-3.3v3.8h-2.1V15h-3.3v3.9h-4.1l.7 3.5h1.8c.9 0 1.3.4 1.3 1.2V40c0 .9-.3 1.3-1.2 1.3h-2l-.8 3.8h4.3V49h3.3v-3.9h2.1V49h3.3v-3.9c5 .2 8.3-1.5 9-5.6.5-3.1-.9-4.9-3.3-5.8Zm-10.3-6.6h2.7c2.3 0 4.4.4 4.8 2.8.4 2.2-1.1 3.2-3.5 3.2h-4V22.1Zm5.4 19.7h-5.4v-6.6h5.6c2.7 0 4.5.8 4 3.6-.4 2.4-2.4 3-4.2 3Z"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 text-paper" aria-label="STACKHOUSE home">
      <BitcoinMark className={compact ? "h-10 w-10 shrink-0" : "h-12 w-12 shrink-0"} />
      <span className="leading-none">
        <span
          className={`block font-mark uppercase ${compact ? "text-[1.35rem] tracking-[0.06em]" : "text-[1.7rem] tracking-[0.08em]"}`}
        >
          <span className="font-semibold text-paper">Stack</span>
          <span className="font-semibold text-[#F7931A]">House</span>
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
