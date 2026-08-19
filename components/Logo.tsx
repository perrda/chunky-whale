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
      {/* Official bitboy ₿ (~14°). Keep in sync with public/brand/bitcoin-coin.svg */}
      <g transform="translate(0.065 0.038)">
        <path
          fill="#fff"
          d="M46.11,27.441c0.636-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.614c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.423,0.355,1.679,1.296,1.636,2.044l-1.637,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.75,4.037,4.588,1.144c0.85,0.213,1.684,0.436,2.504,0.646l-1.453,5.834,3.507,0.875,1.438-5.782c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c6.009,1.137,10.522,0.676,12.419-4.759,1.528-4.38-0.076-6.909-3.226-8.559,2.294-0.529,4.022-2.04,4.483-5.155zm-8.022,11.249c-1.085,4.363-8.426,2.003-10.806,1.412l2.081-8.342c2.38,0.594,10.046,1.772,8.725,6.93zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.684-6.748c1.982,0.494,8.365,1.416,7.398,5.291z"
        />
      </g>
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
