/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // PWA configuration will be added in Sprint 6
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Performance optimizations for MiniPay
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
