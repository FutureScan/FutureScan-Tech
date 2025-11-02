import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'images.cryptocompare.com',
      },
      {
        protocol: 'https',
        hostname: '**.cryptocompare.com',
      },
    ],
  },
};

export default nextConfig;
