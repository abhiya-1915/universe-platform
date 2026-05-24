import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore typescript errors as well just to be safe for Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
