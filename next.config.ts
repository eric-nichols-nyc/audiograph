import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'i.scdn.co',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'i.ytimg.com',
      'pbs.twimg.com',
      'pbs.twimg.com',
      'pbs.twimg.com',
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
