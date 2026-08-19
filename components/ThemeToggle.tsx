"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/theme-store";
import { usePersistReady } from "@/lib/use-persist-ready";

export function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  const ready = usePersistReady(useTheme.persist);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-theme", useTheme.getState().theme);
  }, [ready, theme]);

  if (!ready) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-transparent" aria-hidden>
        Dark
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/80 hover:text-ember"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
