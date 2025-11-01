import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001', 'https://glorious-umbrella-975jrgrq9g7cx4vr-3001.app.github.dev/', 'localhost:3000', 'https://glorious-umbrella-975jrgrq9g7cx4vr-3000.app.github.dev/'],
    },
  },
  crossOrigin: 'anonymous',  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};


export default nextConfig;
