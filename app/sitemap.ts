import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { COLLECTION_META } from "@/lib/nav";
import { liveProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
    "/login",
    "/sizes",
    "/forge",
    "/about",
    "/faq",
    "/shipping",
    "/wholesale",
    "/legal/terms",
    "/legal/privacy",
    "/legal/refunds",
    ...liveProducts().map((p) => `/product/${p.slug}`),
    ...COLLECTION_META.map((c) => `/collection/${c.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
