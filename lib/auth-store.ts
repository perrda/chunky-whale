"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Account = { email: string; name: string };

type AuthState = {
  account: Account | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
};

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
    { name: "hm-account", skipHydration: true },
  ),
);
