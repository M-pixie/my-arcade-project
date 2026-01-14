/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ❌ Wo 'experimental' wala part hata diya hai maine
};

module.exports = nextConfig;