import type { Metadata } from "next";

export const metadata: Metadata = { title: "Basket" };

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
