"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="drop-email">
        Email
      </label>
      <input
        id="drop-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 border border-paper/20 bg-ink px-4 py-3 font-mono text-sm text-paper placeholder:text-muted"
      />
      <button
        type="submit"
        className="bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
      >
        Join drops
      </button>
      {status === "ok" ? (
        <p className="font-serif text-sm text-gold">You are on the list.</p>
      ) : null}
      {status === "err" ? (
        <p className="font-serif text-sm text-ember">That email did not work. Try again.</p>
      ) : null}
    </form>
  );
}
