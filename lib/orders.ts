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
};

const file = path.join(process.cwd(), ".data", "orders.json");

let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function load(): Promise<Order[]> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function save(orders: Order[]) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(orders, null, 2));
}

export async function createOrder(order: Order) {
  return withLock(async () => {
    const orders = await load();
    orders.push(order);
    await save(orders);
    return order;
  });
}

export async function getOrder(id: string) {
  const orders = await load();
  return orders.find((o) => o.id === id);
}

export async function markPaid(id: string, providerRef?: string) {
  return withLock(async () => {
    const orders = await load();
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return null;
    if (orders[i].status === "paid") return orders[i];
    orders[i] = { ...orders[i], status: "paid", providerRef: providerRef ?? orders[i].providerRef };
    await save(orders);
    return orders[i];
  });
}

export async function claimFulfillment(id: string) {
  return withLock(async () => {
    const orders = await load();
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0 || orders[i].status !== "paid") return null;
    if (orders[i].fulfilled && orders[i].printfulId && orders[i].printfulId !== "pending") {
      return null;
    }
    orders[i] = { ...orders[i], fulfilled: true, printfulId: "pending" };
    await save(orders);
    return orders[i];
  });
}

export async function releaseFulfillment(id: string) {
  return withLock(async () => {
    const orders = await load();
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return null;
    if (orders[i].printfulId && orders[i].printfulId !== "pending") return orders[i];
    orders[i] = { ...orders[i], fulfilled: false, printfulId: undefined };
    await save(orders);
    return orders[i];
  });
}

export async function markFulfilled(id: string, printfulId?: string) {
  return withLock(async () => {
    const orders = await load();
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return null;
    if (orders[i].fulfilled && orders[i].printfulId && orders[i].printfulId !== "pending") {
      return orders[i];
    }
    orders[i] = { ...orders[i], fulfilled: true, printfulId };
    await save(orders);
    return orders[i];
  });
}

export function newOrderId() {
  const n = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SH-${Date.now().toString(36).toUpperCase()}-${n}`;
}
