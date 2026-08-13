"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MEGA_NAV } from "@/lib/nav";

export function MegaNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  if (mobile) {
    return (
      <ul className="flex flex-col gap-3">
        {MEGA_NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="font-display text-sm font-bold uppercase tracking-wide">
              {item.label}
            </Link>
            {item.children ? (
              <ul className="mt-2 ml-3 space-y-1">
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="font-serif text-sm text-paper/70">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="hidden items-center gap-1 lg:flex" aria-label="Primary">
      {MEGA_NAV.map((item) => {
        const active = pathname === item.href || item.children?.some((c) => c.href === pathname);
        return (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => setOpen(item.label)}
            onMouseLeave={() => setOpen(null)}
          >
            <Link
              href={item.href}
              className={`inline-flex items-center gap-1 px-2.5 py-2 font-display text-[13px] font-bold ${
                active ? "text-ember" : "text-paper/80 hover:text-paper"
              }`}
              aria-expanded={item.children ? open === item.label : undefined}
            >
              {item.label}
              {item.children ? <span className="text-[10px] opacity-60">▾</span> : null}
            </Link>
            {item.children && open === item.label ? (
              <div className="absolute left-0 top-full z-50 min-w-48 border border-paper/10 bg-ink py-2 shadow-sm">
                {item.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block px-4 py-2 font-serif text-sm text-paper/80 hover:bg-surface hover:text-ember"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
