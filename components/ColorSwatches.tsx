"use client";

import type { ColorOption } from "@/lib/products";

/** Twelve garment colours sit as two centred rows of six. Fewer colours stay centred in the same cell. */
export function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: ColorOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const shown = colors.slice(0, 12);
  return (
    <div className="mt-2 flex justify-center" aria-label="Preview colours">
      <div className="flex w-[10.875rem] flex-wrap justify-center gap-1.5">
        {shown.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            aria-label={`Preview ${c.label}`}
            aria-pressed={value === c.id}
            onClick={() => onChange(c.id)}
            className={`h-6 w-6 rounded-full border ${
              value === c.id ? "border-ember ring-1 ring-ember" : "border-paper/25"
            }`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </div>
  );
}

export function ColorChoiceGrid({
  colors,
  value,
  onChange,
  name = "color",
}: {
  colors: ColorOption[];
  value: string;
  onChange: (id: string) => void;
  name?: string;
}) {
  return (
    <div className="mt-2 grid grid-cols-2 justify-items-stretch gap-2 sm:grid-cols-3 md:grid-cols-6">
      {colors.map((c) => (
        <label
          key={c.id}
          className={`flex cursor-pointer items-center justify-center gap-2 border px-2 py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] sm:text-xs ${
            value === c.id ? "border-ember text-ember" : "border-paper/20 text-paper/80"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={c.id}
            checked={value === c.id}
            onChange={() => onChange(c.id)}
            className="sr-only"
          />
          <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-paper/30" style={{ background: c.hex }} />
          <span className="truncate">{c.label}</span>
        </label>
      ))}
    </div>
  );
}
