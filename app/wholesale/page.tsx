"use client";

import { useState } from "react";

export default function WholesalePage() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/wholesale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        org: fd.get("org"),
        message: fd.get("message"),
      }),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Wholesale</h1>
      <p className="mt-4 font-serif text-paper/80">
        Meetups, shops, and conference partners. Tell us who you are. We will reply with a short line sheet — no automated discount.
      </p>
      {status === "ok" ? (
        <p className="mt-8 font-serif text-gold">Received. We will write back.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <L name="name" label="Name" />
          <L name="email" label="Email" type="email" />
          <L name="org" label="Organisation" />
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Note</span>
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              className="mt-1 w-full border border-paper/20 bg-ink px-3 py-2 font-serif text-paper"
            />
          </label>
          {status === "err" ? <p className="font-serif text-sm text-ember">Check the fields and try again.</p> : null}
          <button type="submit" className="bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            Send
          </button>
        </form>
      )}
    </div>
  );
}

function L({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-1 w-full border border-paper/20 bg-ink px-3 py-2 font-serif text-paper"
      />
    </label>
  );
}
