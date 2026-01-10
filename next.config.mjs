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
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Prevent Next.js from analyzing static paths in API routes
      // This prevents large directories from being bundled into serverless functions
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/public\/videos\/instagram/,
        })
      );
      
      // Exclude fs/promises and path from being analyzed for static imports
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'fs/promises': 'commonjs fs/promises',
          'path': 'commonjs path',
        });
      }
    }
    return config;
  },
  // Exclude filesystem packages from server component analysis
  experimental: {
    serverComponentsExternalPackages: ['fs/promises'],
  },
};

export default nextConfig;

