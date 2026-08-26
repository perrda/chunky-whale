import "server-only";
import { randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type PaymentMethod = "card" | "bitcoin" | "usdc" | "usdt";

export type Order = {
  id: string;
  email: string;
  name: string;
  address1: string;
  city: string;
  country: string;
  postcode: string;
  method: PaymentMethod;
  items: { slug: string; size?: string; color?: string; qty: number; priceGbp: number }[];
  itemsGbp?: number;
  shipGbp?: number;
  totalGbp: number;
  status: "pending" | "paid" | "failed";
  demo: boolean;
  createdAt: string;
  providerRef?: string;
  payUrl?: string;
  fulfilled?: boolean;
  printfulId?: string;
  /** Unguessable token required to view the success page. */
  viewToken?: string;
};

const dir = path.join(process.cwd(), ".data", "orders");

let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function safeOrderId(id: string) {
  return /^SH-[A-Z0-9]+$/.test(id) ? id : null;
}

function orderPath(id: string) {
  return path.join(dir, `${id}.json`);
}

async function readOrderFile(id: string): Promise<Order | null> {
  const safe = safeOrderId(id);
  if (!safe) return null;
  try {
    const raw = await readFile(orderPath(safe), "utf8");
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

async function writeOrderFile(order: Order) {
  await mkdir(dir, { recursive: true });
  await writeFile(orderPath(order.id), JSON.stringify(order));
}

export async function createOrder(order: Order) {
  return withLock(async () => {
    await writeOrderFile(order);
    return order;
  });
}

export async function getOrder(id: string) {
  return readOrderFile(id);
}

export async function markPaid(id: string, providerRef?: string) {
  return withLock(async () => {
    const order = await readOrderFile(id);
    if (!order) return null;
    if (order.demo) {
      console.error("Refused to mark a demo order paid", id);
      return null;
    }
    if (order.status === "paid") return order;
    if (order.status === "failed") return null;
    const next = { ...order, status: "paid" as const, providerRef: providerRef ?? order.providerRef };
    await writeOrderFile(next);
    return next;
  });
}

export async function claimFulfillment(id: string) {
  return withLock(async () => {
    const order = await readOrderFile(id);
    if (!order || order.status !== "paid") return null;
    if (order.fulfilled && order.printfulId && order.printfulId !== "pending") {
      return null;
    }
    const next = { ...order, fulfilled: true, printfulId: "pending" };
    await writeOrderFile(next);
    return next;
  });
}

export async function releaseFulfillment(id: string) {
  return withLock(async () => {
    const order = await readOrderFile(id);
    if (!order) return null;
    if (order.printfulId && order.printfulId !== "pending") return order;
    const next = { ...order, fulfilled: false, printfulId: undefined };
    await writeOrderFile(next);
    return next;
  });
}

export async function markFulfilled(id: string, printfulId?: string) {
  return withLock(async () => {
    const order = await readOrderFile(id);
    if (!order) return null;
    if (order.fulfilled && order.printfulId && order.printfulId !== "pending") {
      return order;
    }
    const next = { ...order, fulfilled: true, printfulId };
    await writeOrderFile(next);
    return next;
  });
}

export async function updateOrder(id: string, patch: Partial<Omit<Order, "id">>) {
  return withLock(async () => {
    const order = await readOrderFile(id);
    if (!order) return null;
    const next = { ...order, ...patch };
    await writeOrderFile(next);
    return next;
  });
}

export function newOrderId() {
  return `SH-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function newViewToken() {
  return randomBytes(18).toString("base64url");
}

export function viewTokensMatch(expected?: string, given?: string) {
  if (!expected || !given) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(given);
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export type PublicOrder = Pick<
  Order,
  "id" | "email" | "method" | "items" | "itemsGbp" | "shipGbp" | "totalGbp" | "status" | "demo"
>;

/** Receipt view only — never returns address, viewToken, or a miss. */
export async function getOrderForReceipt(id?: string, token?: string): Promise<PublicOrder | null> {
  if (!id || !token) return null;
  const found = await getOrder(id);
  if (!found || !viewTokensMatch(found.viewToken, token)) return null;
  return {
    id: found.id,
    email: found.email,
    method: found.method,
    items: found.items,
    itemsGbp: found.itemsGbp,
    shipGbp: found.shipGbp,
    totalGbp: found.totalGbp,
    status: found.status,
    demo: found.demo,
  };
}
