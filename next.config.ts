import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pavanelliarquitetura.com.br' }],
        destination: 'https://www.pavanelliarquitetura.com.br/:path*',
        permanent: true,
      },
    ];
  },
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54331',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
