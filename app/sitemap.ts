import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
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
    ...products.map((p) => `/product/${p.slug}`),
    "/collection/tees",
    "/collection/longsleeves",
    "/collection/hoodies",
    "/collection/hats",
    "/collection/home",
    "/collection/bags",
    "/collection/accessories",
    "/collection/events",
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
