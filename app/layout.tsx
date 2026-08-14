import type { Metadata } from "next";
import { Geist_Mono, Noto_Naskh_Arabic, Source_Serif_4, Syne } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/lib/config";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const source = Source_Serif_4({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "STACKHOUSE — Bitcoin merch, forged not printed",
    template: "%s · STACKHOUSE",
  },
  description:
    "Bitcoin merch house. Tees, hoodies, hats, home. Pay with card, Bitcoin + Lightning, USDC, or USDT.",
  openGraph: {
    title: "STACKHOUSE — Forged, not printed.",
    description: "Original Bitcoin merch. Card, sats, USDC, and USDT.",
    images: ["/hero-forge.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STACKHOUSE",
    images: ["/hero-forge.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${source.variable} ${geistMono.variable} ${naskh.variable} bg-ink text-paper antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
