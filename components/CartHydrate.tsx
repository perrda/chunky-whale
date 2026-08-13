"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

export function CartHydrate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
