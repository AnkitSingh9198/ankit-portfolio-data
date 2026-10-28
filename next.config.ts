import type { NextConfig } from "next";

/**
 * Static export: the whole site compiles to plain HTML/CSS/JS in `out/`,
 * so it can be hosted on Vercel, Netlify, GitHub Pages, Hostinger or any CDN.
 * Remove `output: "export"` if you later add server features (API routes etc.).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // PREVIEW_RELATIVE=1 produces a build that works from any sub-path (used for the hosted preview only)
  assetPrefix: process.env.PREVIEW_RELATIVE ? "." : undefined,
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
