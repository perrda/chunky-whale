import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { collections, liveProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
    "/login",
    "/sizes",
    "/forge",
    "/events",
    "/events/mena-2026",
    "/about",
    "/faq",
    "/shipping",
    "/fulfillment",
    "/wholesale",
    "/legal/terms",
    "/legal/privacy",
    "/legal/refunds",
    ...liveProducts().map((p) => `/product/${p.slug}`),
    ...collections.map((c) => `/collection/${c.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
