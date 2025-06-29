/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  generateBuildId: () => 'build',
  distDir: '.next'
}

module.exports = nextConfig