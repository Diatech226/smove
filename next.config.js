// file: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
