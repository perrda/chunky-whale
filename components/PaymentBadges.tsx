export function PaymentBadges() {
  const methods = [
    { id: "card", label: "Card", note: "Visa · Mastercard · Stripe" },
    { id: "btc", label: "Bitcoin + Lightning", note: "OpenNode" },
    { id: "usdc", label: "USDC", note: "Coinbase Commerce" },
    { id: "usdt", label: "USDT", note: "NOWPayments" },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {methods.map((m) => (
        <li key={m.id} className="border border-paper/15 bg-surface px-4 py-4">
          <p className="font-display text-sm font-bold tracking-wide">{m.label}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{m.note}</p>
        </li>
      ))}
    </ul>
  );
}
