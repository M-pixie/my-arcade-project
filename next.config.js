/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Purani settings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 👇 ✅ YEH SETTING ZAROORI HAI (Isse 'directory not exist' wala error hat jayega)
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
};

module.exports = nextConfig;