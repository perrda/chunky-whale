import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">This mark does not exist.</h1>
      <Link href="/shop" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
        Back to shop
      </Link>
    </div>
  );
}
