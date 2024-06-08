/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_COOKIE_SECRET: process.env.NEXT_PUBLIC_COOKIE_SECRET,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
