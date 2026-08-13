"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-store";

export function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void useTheme.persist.rehydrate();
    const stored = useTheme.getState().theme;
    document.documentElement.setAttribute("data-theme", stored);
    setReady(true);
  }, []);

  if (!ready) return null;

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
