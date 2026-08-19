import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { PendingRefresh } from "@/components/PendingRefresh";
import { formatGbp, getProduct } from "@/lib/products";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order" };

type Props = { searchParams: Promise<{ order?: string; demo?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { order: id } = await searchParams;
  const order = id ? await getOrder(id) : null;
  const confirmed = Boolean(order && (order.demo || order.status === "paid"));
  const pending = Boolean(order && !order.demo && order.status === "pending");
  const failed = Boolean(order && order.status === "failed");

  const kicker = !order
    ? "Order"
    : failed
      ? "Payment failed"
      : pending
        ? "Waiting for payment"
        : order.demo
          ? "Demo order"
          : "Payment confirmed";

  const heading = failed
    ? "Nothing was taken."
    : pending
      ? "Confirming your payment."
      : "The stamp is in motion.";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      {confirmed ? <ClearCart /> : null}
      <PendingRefresh active={pending} />
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{kicker}</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{heading}</h1>
      {order ? (
        <>
          <p className="mt-4 font-mono text-sm text-ember">{order.id}</p>
          <p className="mt-4 font-serif text-paper/80">
            {order.demo
              ? "Payment providers are not connected yet, so this is a practice order. Nothing was charged. When Stripe, OpenNode, Coinbase, and NOWPayments keys are in .env, this screen will follow a real payment."
              : pending
                ? `We have the order, but ${order.method} has not confirmed yet. This page refreshes itself. Keep this tab open — your basket stays until payment lands.`
                : failed
                  ? "The payment did not complete. Your basket is still there. Try again from checkout."
                  : `Paid with ${order.method}. We will email ${order.email} when Printful starts the print.`}
          </p>
          <ul className="mt-8 space-y-2 font-serif">
            {order.items.map((i) => (
              <li key={`${i.slug}-${i.size}-${i.color}`}>
                {getProduct(i.slug)?.name} {i.color ? `${i.color} ` : ""}
                {i.size ? `(${i.size})` : ""} × {i.qty} — {formatGbp(i.priceGbp * i.qty)}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-gold">{formatGbp(order.totalGbp)}</p>
          {order.method === "bitcoin" && order.demo ? (
            <div className="mt-8 border border-paper/15 bg-surface p-6">
              <p className="font-display font-bold">Bitcoin / Lightning (demo)</p>
              <p className="mt-2 font-serif text-sm text-paper/75">
                Live mode shows an OpenNode invoice (on-chain address + Lightning QR). At Bitcoin MENA the same flow
                sits on a tablet as POS.
              </p>
              <div className="mt-4 grid place-items-center border border-dashed border-ember/50 p-8">
                <span className="ember-pulse h-24 w-24 rounded-full border-4 border-ember" />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  Invoice QR placeholder
                </p>
              </div>
            </div>
          ) : null}
          {order.method === "usdt" && order.demo ? (
            <div className="mt-8 border border-paper/15 bg-surface p-6">
              <p className="font-display font-bold">USDT (demo)</p>
              <p className="mt-2 font-serif text-sm text-paper/75">
                Live mode opens a NOWPayments invoice priced in GBP, paid in USDT (TRC-20 by default). USDC remains on
                Coinbase Commerce.
              </p>
            </div>
          ) : null}
          {order.method === "usdc" && order.demo ? (
            <div className="mt-8 border border-paper/15 bg-surface p-6">
              <p className="font-display font-bold">USDC (demo)</p>
              <p className="mt-2 font-serif text-sm text-paper/75">
                Live mode opens Coinbase Commerce. Customer pays USDC at a locked GBP amount.
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 font-serif">We could not find that order. Check the link from checkout.</p>
      )}
      <Link href="/shop" className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
        Continue shopping
      </Link>
    </div>
  );
}
