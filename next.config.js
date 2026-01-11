/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel supports full Next.js features including API routes
  images: {
    unoptimized: false, // Vercel optimizes images automatically
  },
};

module.exports = nextConfig;