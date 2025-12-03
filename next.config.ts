import type { NextConfig } from "next";

/**
 * Next.js Configuration - UI Only Version
 * This configuration is simplified for UI-only mockup version
 */
const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for better performance
    optimizePackageImports: ['lucide-react', 'react-hot-toast'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
