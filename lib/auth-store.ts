"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Account = { email: string; name: string };

type AuthState = {
  account: Account | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
};

const KEY = "stackhouse-account";
const LEGACY_KEY = "hm-account";

function migrateLegacyAccount() {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(KEY)) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        localStorage.setItem(KEY, legacy);
        localStorage.removeItem(LEGACY_KEY);
      }
    }
  } catch {
    /* ignore */
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      signIn: (email, name) =>
        set({
          account: { email: email.trim().toLowerCase(), name: name?.trim() || email.split("@")[0] },
        }),
      signOut: () => set({ account: null }),
    }),
    { name: KEY, skipHydration: true },
  ),
);

export function rehydrateAuth() {
  migrateLegacyAccount();
  return useAuth.persist.rehydrate();
}
