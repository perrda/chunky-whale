"use client";

import { useEffect } from "react";
import { rehydrateAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { useShipPref } from "@/lib/ship-pref";
import { useTheme } from "@/lib/theme-store";

export function CartHydrate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useShipPref.persist.rehydrate();
    void rehydrateAuth();
    void useTheme.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
