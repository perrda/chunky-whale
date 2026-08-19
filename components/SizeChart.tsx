"use client";

import { useState } from "react";
import { chestFor, REGION_CHARTS, SIZE_REGIONS, type SizeRegion } from "@/lib/sizing";

export function SizeChart({ kind }: { kind?: "tees" | "hoodies" }) {
  const [region, setRegion] = useState<SizeRegion>("eu");
  const rows = kind === "hoodies" ? REGION_CHARTS.hoodies : REGION_CHARTS.tees;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {SIZE_REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            aria-pressed={region === r.id}
            className={`font-mono text-[10px] uppercase tracking-[0.16em] border px-3 py-1.5 ${
              region === r.id ? "border-ember text-ember" : "border-paper/20 text-paper/70"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <caption className="sr-only">Size chart</caption>
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
              <th scope="col" className="py-2">
                Size
              </th>
              <th scope="col">Chest</th>
              <th scope="col">Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t border-paper/10 font-serif text-paper/85">
                <td className="py-2">{r.size}</td>
                <td>{chestFor(r, region)}</td>
                <td>{r.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-serif text-xs text-paper/60">
        Unisex. Asia runs slightly smaller — if you are between sizes, take the larger. Measure a tee you already like.
      </p>
    </div>
  );
}
