"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MEGA_NAV, type NavItem } from "@/lib/nav";

export function MegaNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  if (mobile) {
    return (
      <ul className="flex flex-col gap-1">
        {MEGA_NAV.map((item) => (
          <MobileItem key={item.href} item={item} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="hidden items-center gap-1 lg:flex" aria-label="Primary">
      {MEGA_NAV.map((item) => {
        const active = pathname === item.href || item.children?.some((c) => c.href === pathname);
        const expanded = open === item.label;
        return (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => item.children && setOpen(item.label)}
            onMouseLeave={() => setOpen(null)}
            onFocus={() => item.children && setOpen(item.label)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(null);
            }}
          >
            <div className="inline-flex items-center">
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1 px-2.5 py-2 font-display text-[13px] font-bold ${
                  active ? "text-ember" : "text-paper/80 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
              {item.children ? (
                <button
                  type="button"
                  className="px-1 py-2 text-[10px] opacity-60"
                  aria-expanded={expanded}
                  aria-haspopup="true"
                  aria-label={`${item.label} menu`}
                  onClick={() => setOpen(expanded ? null : item.label)}
                >
                  ▾
                </button>
              ) : null}
            </div>
            {item.children && expanded ? (
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

function MobileItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-paper/10 py-2 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <Link href={item.href} className="font-display text-base font-bold uppercase tracking-wide">
          {item.label}
        </Link>
        {item.children ? (
          <button
            type="button"
            className="shrink-0 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70"
            aria-expanded={open}
            aria-label={`${item.label} submenu`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {item.children && open ? (
        <ul className="mt-2 ml-1 space-y-1 pb-2">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="block py-1.5 font-serif text-sm text-paper/70">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
