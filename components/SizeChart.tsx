import { SIZE_CHART } from "@/lib/products";

export function SizeChart({ kind }: { kind?: "tees" | "hoodies" }) {
  const rows = kind === "hoodies" ? SIZE_CHART.hoodies : SIZE_CHART.tees;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] text-left text-sm">
        <caption className="sr-only">Size chart in centimetres</caption>
        <thead>
          <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
            <th className="py-2">Size</th>
            <th>Chest (cm)</th>
            <th>Length (cm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size} className="border-t border-paper/10 font-serif text-paper/85">
              <td className="py-2">{r.size}</td>
              <td>{r.chest}</td>
              <td>{r.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
