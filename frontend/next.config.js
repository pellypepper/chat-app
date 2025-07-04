/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  generateBuildId: () => 'build',
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pelly-chat.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
};

module.exports = nextConfig;