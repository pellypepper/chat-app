/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  generateBuildId: () => 'build',
  distDir: '.next',
  images: {
    domains: ['pelly-chat.s3.eu-north-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
