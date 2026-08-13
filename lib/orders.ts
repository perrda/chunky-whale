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
  items: { slug: string; size?: string; qty: number; priceGbp: number }[];
  totalGbp: number;
  status: "pending" | "paid" | "failed";
  demo: boolean;
  createdAt: string;
  providerRef?: string;
  payUrl?: string;
};

const file = path.join(process.cwd(), ".data", "orders.json");

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
  const orders = await load();
  orders.push(order);
  await save(orders);
  return order;
}

export async function getOrder(id: string) {
  const orders = await load();
  return orders.find((o) => o.id === id);
}

export async function markPaid(id: string, providerRef?: string) {
  const orders = await load();
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  orders[i] = { ...orders[i], status: "paid", providerRef };
  await save(orders);
  return orders[i];
}

export function newOrderId() {
  const n = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `OF-${Date.now().toString(36).toUpperCase()}-${n}`;
}
