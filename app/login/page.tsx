"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-store";

export default function LoginPage() {
  const signIn = useAuth((s) => s.signIn);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a real email so we can find the order later.");
      return;
    }
    signIn(email, name);
    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Account</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Login</h1>
      <p className="mt-3 font-serif text-paper/75">
        Demo login — no password yet. When Stripe/Printful go live this becomes a real account. Use the email you will
        check out with.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-paper/20 bg-surface px-3 py-2 text-paper"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-paper/20 bg-surface px-3 py-2 text-paper"
            autoComplete="email"
          />
        </label>
        {error ? <p className="font-serif text-sm text-ember">{error}</p> : null}
        <button type="submit" className="bg-ember px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
          Continue
        </button>
        <p className="font-serif text-sm text-paper/70">
          No account? <a href="/checkout" className="text-ember">Checkout as guest</a> — email on the order is enough.
        </p>
      </form>
    </div>
  );
}
