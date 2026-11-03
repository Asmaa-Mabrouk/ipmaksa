import type { NextConfig } from "next";

const supa = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Admin image uploads go through server actions: allow up to 6 MB (default is 1 MB).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supa ? [{ protocol: "https", hostname: supa.hostname, pathname: "/storage/v1/object/public/**" }] : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ...(process.env.SITE_ENV === "staging" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] : []),
      ] },
      { source: "/(images|flags)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
