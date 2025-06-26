/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Handle static file serving
  trailingSlash: false,
  // Optimize for production
  compress: true,
  // Handle API routes properly
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig