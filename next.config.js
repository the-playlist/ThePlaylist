/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_LISTNER_URI: "http://localhost:3001",
  },
  reactStrictMode: false,
};
module.exports = nextConfig;
