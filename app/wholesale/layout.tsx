import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "ORANGEFORGE wholesale and meetup partner enquiries.",
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
