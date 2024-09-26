/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
