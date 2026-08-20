import type { NextConfig } from "next";

const extraDevOrigin = (process.env.ALLOWED_DEV_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""))
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0", "*.local", ...extraDevOrigin],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/events", destination: "/", permanent: true },
      { source: "/events/:path*", destination: "/", permanent: true },
      { source: "/collection/events", destination: "/shop", permanent: true },
      { source: "/fulfillment", destination: "/shipping", permanent: true },
      { source: "/blog", destination: "/shop", permanent: true },
      { source: "/blog/:path*", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;
