import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Naskh_Arabic, Oswald, Source_Serif_4, Syne } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/lib/config";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Bitcoin merch Bitcoiners actually wear. HODL, 21 million, Satoshi, the ₿. Card, Bitcoin + Lightning, USDC, and USDT — demo until payment keys are live.",
  icons: {
    icon: [
      { url: "/brand/chunky-whale-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/brand/chunky-whale-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: "Original Bitcoin merch. Card, sats, USDC, and USDT — demo until keys are live.",
    images: ["/brand/og-chunky-whale.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    site: site.twitterHandle,
    creator: site.twitterHandle,
    images: ["/brand/og-chunky-whale.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sh-theme');if(t){var j=JSON.parse(t);document.documentElement.setAttribute('data-theme',j.state&&j.state.theme?j.state.theme:'light');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${oswald.variable} ${source.variable} ${geistMono.variable} ${naskh.variable} bg-ink text-paper antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
