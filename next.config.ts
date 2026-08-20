import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0", "*.local"],
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/events", destination: "/", permanent: true },
      { source: "/events/:path*", destination: "/", permanent: true },
      { source: "/collection/events", destination: "/shop", permanent: true },
      { source: "/blog", destination: "/shop", permanent: true },
      { source: "/blog/:path*", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;
