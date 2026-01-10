/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude public/videos directory from serverless function bundles
      // This prevents the large media files from being included in the function
      config.externals = config.externals || [];
      config.externals.push({
        'fs/promises': 'commonjs fs/promises',
        'path': 'commonjs path',
      });
    }
    return config;
  },
  // Exclude the media scan route from being analyzed during build
  // Since it reads from public directory which won't work in Vercel serverless anyway
  experimental: {
    serverComponentsExternalPackages: ['fs/promises'],
  },
};

export default nextConfig;

