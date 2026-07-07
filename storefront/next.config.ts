import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Autorise les images produits servies par le CDN Shopify
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default config;
