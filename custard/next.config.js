/** @type {import('next').NextConfig} */
const nextConfig = {
  // BEFORE PUSHING TO PROD, TURN BACK ON FOR TESTING
  // reactStrictMode: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
