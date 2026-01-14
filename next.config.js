/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // 👇 Naya Naam: @sparticuz/chromium-min
    serverComponentsExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
  },
};

module.exports = nextConfig;