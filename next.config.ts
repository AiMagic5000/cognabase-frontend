import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance and security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },
  // Optimize images
  images: {
    unoptimized: true, // For static exports if needed
  },
  // Compression
  compress: true,
  // Generate static pages where possible
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
