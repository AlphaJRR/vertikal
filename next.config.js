/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'www.dropbox.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Only use app directory for routing, ignore src/pages
  pageExtensions: ['page.tsx', 'page.ts'],
  webpack: (config) => {
    // Exclude src/pages from being treated as Next.js pages
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

module.exports = nextConfig;


