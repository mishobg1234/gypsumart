import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // transpilePackages: ['@uploadthing/react', '@uploadthing/shared', '@uploadthing/mime-types'],
  // serverExternalPackages: ['uploadthing'],
};

export default nextConfig;
