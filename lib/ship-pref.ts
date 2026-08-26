"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CHECKOUT_COUNTRIES, type CheckoutCountry } from "./shipping";

type ShipPref = {
  country: CheckoutCountry;
  setCountry: (country: string) => void;
};

export const useShipPref = create<ShipPref>()(
  persist(
    (set) => ({
      country: "GB",
      setCountry: (country) => {
        if ((CHECKOUT_COUNTRIES as readonly string[]).includes(country)) {
          set({ country: country as CheckoutCountry });
        }
      },
    }),
    { name: "stackhouse-ship", skipHydration: true },
  ),
);
