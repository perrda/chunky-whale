import "server-only";
import { getOrder, markPaid, type Order } from "@/lib/orders";
import { gbpAmountsMatch, penceMatchesGbp } from "@/lib/payments/amount";

export type ConfirmPaidResult =
  | { ok: true; order: Order; already: boolean }
  | {
      ok: false;
      error: "missing_order" | "demo_order" | "failed_order" | "amount_mismatch" | "amount_missing";
    };

/**
 * Mark an order paid only after the provider amount matches our catalog total.
 * Missing amount, demo orders, and mismatches fail closed — never fulfil.
 */
export async function confirmPaidOrder(input: {
  orderId: string;
  providerRef?: string;
  paidGbp?: number;
  paidPence?: number;
}): Promise<ConfirmPaidResult> {
  const order = await getOrder(input.orderId);
  if (!order) return { ok: false, error: "missing_order" };
  if (order.demo) return { ok: false, error: "demo_order" };
  if (order.status === "failed") return { ok: false, error: "failed_order" };

  const hasPence = typeof input.paidPence === "number" && Number.isFinite(input.paidPence);
  const hasGbp = typeof input.paidGbp === "number" && Number.isFinite(input.paidGbp);
  if (!hasPence && !hasGbp) return { ok: false, error: "amount_missing" };
  if (hasPence && !penceMatchesGbp(order.totalGbp, input.paidPence as number)) {
    return { ok: false, error: "amount_mismatch" };
  }
  if (hasGbp && !gbpAmountsMatch(order.totalGbp, input.paidGbp as number)) {
    return { ok: false, error: "amount_mismatch" };
  }

  if (order.status === "paid") return { ok: true, order, already: true };
  const paid = await markPaid(input.orderId, input.providerRef);
  if (!paid) return { ok: false, error: "missing_order" };
  return { ok: true, order: paid, already: false };
}

export function confirmFailStatus(
  error: "missing_order" | "demo_order" | "failed_order" | "amount_mismatch" | "amount_missing",
) {
  if (error === "missing_order") return 404;
  if (error === "amount_missing" || error === "amount_mismatch") return 400;
  return 409;
}
