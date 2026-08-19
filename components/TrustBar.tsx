const items = [
  { title: "Printed near you", body: "UK, US, EU, and Asia hubs" },
  { title: "30-day returns", body: "Unused, with tags" },
  { title: "Guest checkout", body: "No account required" },
  { title: "Four ways to pay", body: "Card · Bitcoin · USDC · USDT" },
];

export function TrustBar() {
  return (
    <section className="border-y border-paper/10 bg-surface">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="px-4 py-5 md:px-6">
            <p className="font-display text-sm font-bold">{item.title}</p>
            <p className="mt-1 font-serif text-sm text-paper/65">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
