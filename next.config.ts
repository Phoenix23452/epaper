import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store", // Force it to always fetch new file
          },
        ],
      },
    ];
  },
  images: {
    loader: "default",
    path: "/media/", // base path for images
    domains: ["epaper.shahtimesnews.com"],
  },
};

export default nextConfig;
