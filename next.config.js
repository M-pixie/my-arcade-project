/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Tumhari purani settings (Errors ignore karne ke liye)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 👇 ✅ YE HAI NAYA FIX (Isse Chromium wala error hat jayega)
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
};

module.exports = nextConfig;