import type { Metadata } from "next";
import Link from "next/link";
import { EventCountdown } from "@/components/EventCountdown";
import { events, menaMilestones } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description: "STACKHOUSE Bitcoin event timetable. First booth: Bitcoin MENA, Abu Dhabi, 7–8 Dec 2026.",
};

const statusLabel: Record<string, string> = {
  primary: "First booth",
  flagship: "2027 booth",
  optional: "Optional",
  skip: "Skip booth",
  clash: "Date clash",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Timetable</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Where the house appears</h1>
      <p className="mt-4 max-w-2xl font-serif text-paper/80">
        First live activation is Bitcoin MENA. Amsterdam in November is an optional dress rehearsal. Prague and Nashville are the 2027 flagships.
      </p>

      <div className="mt-10 max-w-lg">
        <EventCountdown />
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/product/mena-2026-tee"
          className="bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
        >
          MENA capsule tee
        </Link>
        <Link
          href="/events/mena-2026"
          className="border border-paper/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper"
        >
          Booth kit
        </Link>
      </div>

      <h2 className="mt-16 font-display text-2xl font-extrabold">Road to Abu Dhabi</h2>
      <ol className="mt-6 space-y-6">
        {menaMilestones.map((m) => (
          <li key={m.when} className="border-l border-ember pl-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{m.when}</p>
            <p className="mt-1 font-display text-lg font-bold">{m.title}</p>
            <p className="mt-1 font-serif text-paper/75">{m.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-2xl font-extrabold">Calendar</h2>
      <ul className="mt-6 divide-y divide-paper/10">
        {events.map((e) => (
          <li key={e.id} className="grid gap-2 py-5 md:grid-cols-[8rem_1fr_7rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {e.start.slice(5)} – {e.end.slice(5)}
            </p>
            <div>
              <p className="font-display font-bold">
                {e.name} · {e.city}
              </p>
              <p className="font-serif text-sm text-paper/70">{e.note}</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember md:text-right">
              {statusLabel[e.status]}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-serif text-sm text-muted">
        Dates as announced as of August 2026. Confirm on the organiser site before you book travel. This is a marketing timetable, not financial advice.
      </p>
    </div>
  );
}
