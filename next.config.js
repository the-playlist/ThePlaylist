/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  disable: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});
const nextConfig = {
  reactStrictMode: false,
};
module.exports = withPWA(nextConfig);
