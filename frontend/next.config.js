/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove output: standalone since you're using Next.js programmatically
  // output: 'standalone', // REMOVE THIS LINE
  
  // Remove deprecated options
  experimental: {
    // appDir is no longer needed in Next.js 13.4+
    // swcMinify is now default and not in experimental
  },
  
  // Add proper rewrites for your API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Ensure proper static file handling
  trailingSlash: false,
  
  // Optional: Add proper environment variable handling
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig