/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ["randomuser.me", "cdn-icons-png.flaticon.com"],
  },
};

module.exports = nextConfig;
