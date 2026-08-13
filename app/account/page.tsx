"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";

export default function AccountPage() {
  const account = useAuth((s) => s.account);
  const signOut = useAuth((s) => s.signOut);
  const items = useCart((s) => s.items);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void useAuth.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !account) router.replace("/login");
  }, [ready, account, router]);

  if (!ready || !account) return <p className="px-6 py-20 font-serif text-paper/60">Loading account…</p>;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Account</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Hello, {account.name}</h1>
      <p className="mt-3 font-serif text-paper/80">{account.email}</p>
      <p className="mt-6 font-serif text-paper/75">
        Basket: {items.length} line{items.length === 1 ? "" : "s"}. Orders will appear here once live payment keys are
        in.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/cart" className="bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
          Go to basket
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="border border-paper/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
